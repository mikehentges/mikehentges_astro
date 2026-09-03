---
title: "Running a Local LLM Coding Agent on a 48 GB MacBook Pro"
date: 2026-09-02
summary: "How far can you get with a coding agent running entirely on your own laptop? A Mixture-of-Experts model, a careful memory budget, and a lightweight harness."
hero: ./hero.jpg
---

I've been using cloud-hosted models for coding-agent work for a while now, and they are great – but I kept wondering how far I could get with a model running entirely on my own laptop. No API bills, nothing leaving the machine, and it works on an airplane. The catch is that my laptop is a 48 GB MacBook Pro (M4 Pro), not a 192 GB Mac Studio. It's a "mid-sized" machine for this kind of work, and it's also my daily driver – so whatever I run can't eat the whole box.

This post is the writeup of what worked. Three things made the difference: picking a Mixture-of-Experts model that fits the memory I have, spending that memory on context instead of on parameters I don't need, and using a lightweight agent harness so the context I paid for goes to my code rather than to the tool's overhead. I've included the configuration details – including a hack to get LM Studio to load the model at all – so you can skip the parts I stumbled over.

## What I was after

A coding agent is a loop: the model reads files, runs commands, edits code, and reads the results, over and over. That puts three demands on a local model that a chat session doesn't:

1. **Decode speed.** An agent produces a lot of tokens across many turns. If generation is painfully slow, you stop using it.
2. **Working tool calls.** The model has to emit structured tool calls that the harness can parse, not a prose description of what it would like to do.
3. **A big context window.** Every turn extends the conversation with file contents and command output. 32K fills up fast; 128K is where agent work gets comfortable.

## Picking the model – why a Mixture of Experts

My first attempts were with dense models in the 27B–32B parameter range. At 4 to 6 bits of quantization, they fit in memory. But decode was slow. With a dense model, every generated token has to pass through every weight, and on Apple Silicon you are bound by memory bandwidth – so a 30B model reads roughly 20 GB of weights for each token it produces. That's fine for a chat answer; it's painful when an agent is grinding through its twentieth turn.

A Mixture-of-Experts (MoE) model changes that math. The one I landed on is [Qwen3.6-35B-A3B](https://huggingface.co/AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP): 35 billion parameters in total, but only about 3 billion are active for any given token. Each layer has a set of "experts," and a router picks a handful of them per token. You pay for 35B parameters in memory, but you only pay for roughly 3B of compute and memory traffic per token – so it decodes closer to the speed of a 3B model while carrying the knowledge of something much larger. That is exactly the trade you want on a machine with plenty of memory relative to its bandwidth.

Then came the fit math, working backward from 48 GB:

- macOS will let the GPU wire up to about 36 GB by default. I wanted to stay under that ceiling rather than raise it, so the default limit acts as a safety rail.
- The 6-bit build of this model is about 24.4 GB of text weights once loaded. A plain 4-bit build would be 19–20 GB, but the AXQ quantization I chose mixes 4, 6, and 8-bit precision by layer sensitivity, and the quality difference was worth the 5 GB. It still fits, so take it.
- That leaves roughly 10 GB under the wired limit for context and scratch space – which brings me to the second thing I was after.

### The context bonus

This is the part I didn't appreciate until I dug into the architecture. Qwen3.6-35B-A3B is a *hybrid*: only 10 of its 40 layers use full attention. The other 30 use Gated DeltaNet, which keeps a fixed-size state (about 2 MB per layer) no matter how long the conversation gets. The result is that the KV cache – the memory that grows with your context – costs about **20 KB per token**. That's 2.5 GB at 128K context and 5 GB at the model's full 262K. A conventional model with full attention on every layer would spend several times that on the same context.

So the memory budget for the whole endpoint looks like this:

| Item | GB |
|---|---|
| Text weights (6-bit, vision sidecar dropped) | 24.4 |
| KV cache at 128K context | 2.5 |
| Prefill scratch (transient) | ≈2 |
| Prompt-cache retention cap | ≤4 |
| **Worst case** | **≈33** vs. the ≈36 GB default wired limit |

A 35B-class model with 128K context in 33 GB, on a laptop, with 12 GB left over for macOS and everything else I'm running. That's the combination that makes this practical.

The specific checkpoint is `AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP`, straight out of LM Studio's model catalog. It's about 27 GB on disk, which includes two "sidecar" files – an MTP file for speculative decoding and a vision encoder – that nothing in my setup uses. They can stay on disk; they're never loaded.

## Two engines, one download

There are two good ways to serve an MLX model on a Mac: [LM Studio](https://lmstudio.ai), which is a GUI app with a built-in server, and [mlx-lm](https://github.com/ml-explore/mlx-lm), Apple's command-line library. I ended up using both, and since LM Studio stores models in the plain Hugging Face folder layout, mlx-lm can load LM Studio's download directly. No need to pull 25 GB twice.

```bash
lms ls      # shows the model key
export MODEL="$HOME/.lmstudio/models/AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP"
ls "$MODEL"/config.json "$MODEL"/model.safetensors.index.json
```

mlx-lm goes in its own virtual environment. The checkpoint was converted with mlx-lm 0.31.3, so anything at or above that version reads it:

```bash
mkdir -p ~/llm && cd ~/llm
uv venv .venv --python 3.12
source .venv/bin/activate
uv pip install -U mlx-lm
mlx_lm.server --help | grep -E "prompt-cache|concurrency|chat-template-args"
```

If that grep doesn't show `--prompt-cache-size`, `--prompt-cache-bytes`, `--decode-concurrency`, and `--chat-template-args`, your mlx-lm is too old.

**One rule before going any further:** never have the model loaded in both engines at once. Each holds its own 24 GB copy. Two copies is 50 GB before any context, and macOS starts swapping the moment either one does real work. This is the one scenario that actually brought my machine to its knees. Every time you switch engines:

```bash
lms ps                 # what's loaded in LM Studio
lms unload --all       # harmless if nothing is loaded
lms server stop
```

I also turned off "Just-in-time model loading" in LM Studio's developer settings while I was testing – otherwise a stray request to its port silently reloads the model behind your back.

### Smoke test

One generation, no server, just to see the real numbers:

```bash
mlx_lm.generate --model "$MODEL" \
  --max-tokens 400 --temp 0.6 --top-p 0.95 --top-k 20 \
  --prompt "Explain in three sentences why a MoE model with 3B active parameters decodes quickly on Apple Silicon."
```

On my M4 Pro, generation came in between 50 and 60 tokens per second with peak memory in the 26–27 GB range. For comparison, the dense 30B-class models I tried first were well under half that speed. If your peak lands well above 27 GB, the vision weights probably weren't stripped – check that `model_type` in `config.json` is `qwen3_5_moe`. If generation is way below 30 tokens per second, something else is holding GPU memory – go back and check `lms ps`.

## Serving with mlx-lm

Two of `mlx_lm.server`'s defaults are wrong for this model. Temperature defaults to 0.0, and greedy decoding makes Qwen's thinking models loop. And `--max-tokens` defaults to 512, which truncates any real agent reply. Here's the launch script I settled on, with each flag explained:

```bash
#!/usr/bin/env bash
# ~/llm/serve-qwen.sh – serve Qwen3.6-35B-A3B with mlx-lm, sized for a 48 GB shared MacBook.
set -euo pipefail
source "$HOME/llm/.venv/bin/activate"
MODEL="${MODEL:-$HOME/.lmstudio/models/AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP}"
LOG="$HOME/llm/logs/mlx-server.log"; mkdir -p "$(dirname "$LOG")"

# --host 127.0.0.1            loopback only: the server has no auth
# --temp/top-p/top-k          Qwen's coding + thinking defaults (server default temp is 0.0 → loops)
# --max-tokens 32768          reply ceiling; clients can send less
# --decode-concurrency 2      two parallel decodes covers pi subagents
# --prompt-concurrency 1      prefill one prompt at a time (bounds scratch memory)
# --prompt-cache-size 6       keep up to 6 conversation prefixes ...
# --prompt-cache-bytes 4e9    ... but never more than 4 GB of them
mlx_lm.server \
  --model "$MODEL" \
  --host 127.0.0.1 --port 8080 \
  --temp 0.6 --top-p 0.95 --top-k 20 \
  --max-tokens 32768 \
  --decode-concurrency 2 \
  --prompt-concurrency 1 \
  --prefill-step-size 2048 \
  --prompt-cache-size 6 \
  --prompt-cache-bytes 4000000000 \
  --log-level INFO 2>&1 | tee -a "$LOG"
```

The prompt cache is what makes an agent feel fast. Each turn extends the previous prompt, and the server reuses the cached prefix instead of re-processing the whole conversation. You can prove it's working by sending the same 15K-token prompt twice – the second response should report `cached_tokens` equal to nearly the whole prompt and come back in well under a second.

A couple of things to know when you point a client at it:

- The `/v1/models` endpoint reports the model's *path* as its id. Ignore that and send `"model": "default_model"` in requests – that's the name the server maps to whatever it launched with. Any other name makes it try to load a second model.
- Thinking is on by default. The reasoning comes back in a separate `reasoning` field, with no `<think>` tags in the content. To run in fast non-thinking mode, add `--chat-template-args '{"enable_thinking":false}'` to the launch line.
- Make sure tool calls come back as a structured `tool_calls` array and not as raw `<tool_call>` text in the content. If you see the latter, the tokenizer's tool parser wasn't detected – usually a damaged `tokenizer_config.json`.

## The LM Studio hack

Here's the part that cost me the most time. Loading this model folder in LM Studio fails outright:

```
ValueError: Missing 333 parameters: vision_tower.blocks.0.attn.proj.bias, ...
```

What's going on: this checkpoint keeps its vision encoder in a separate `vision.safetensors` sidecar that isn't listed in the weight index. mlx-lm ignores vision keys on purpose, so it never notices. LM Studio reads the `config.json`, sees a vision-language architecture (`Qwen3_5MoeForConditionalGeneration` with a `vision_config`), takes the vision-language code path, and can't find the tensors. The model card says the vision path isn't validated anyway, so I don't lose anything by giving LM Studio a text-only view of the same weights.

The fix is a "twin" folder that hardlinks the 25 GB of weight shards – no extra disk space – and carries a stripped-down `config.json`. The original folder stays untouched for mlx-lm.

```bash
SRC="$HOME/.lmstudio/models/AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP"
DST="$HOME/.lmstudio/models/AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP-text"
mkdir -p "$DST"
for f in "$SRC"/model-*.safetensors; do ln "$f" "$DST/"; done
cp "$SRC"/{model.safetensors.index.json,tokenizer.json,tokenizer_config.json,chat_template.jinja,generation_config.json} "$DST/"

python3 - <<'EOF'
import json, os
src = os.path.expanduser("~/.lmstudio/models/AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP/config.json")
dst = os.path.expanduser("~/.lmstudio/models/AutomatosX/AX-Qwen3.6-35B-A3B-MLX-AXQ-6bit-MTP-text/config.json")
c = json.load(open(src))
c.pop("vision_config", None)
for k in ("image_token_id", "video_token_id", "vision_start_token_id", "vision_end_token_id"):
    c.pop(k, None)
tc = c.pop("text_config", {})
tc.pop("model_type", None)
c.update(tc)
c["model_type"] = "qwen3_5_moe"
c["architectures"] = ["Qwen3_5MoeForCausalLM"]
json.dump(c, open(dst, "w"), indent=1)
print("wrote", dst, "| layers:", c.get("num_hidden_layers"))
EOF
lms ls
```

The script flattens the nested `text_config` up to the top level and swaps the architecture to the text-only causal LM class. After it runs, `lms ls` shows a new entry – but note the key: LM Studio lowercases the folder name and strips the `6bit` token, so the key is `ax-qwen3.6-35b-a3b-mlx-axq-mtp-text`. That key, not the folder name, is what `lms load` and `lms unload` take. And `df -h` will confirm your free space didn't move; the shards are hardlinks.

Now it loads:

```bash
lms server start --port 1234
lms load ax-qwen3.6-35b-a3b-mlx-axq-mtp-text \
  --context-length 131072 --gpu max --ttl 3600 --parallel 2 --identifier qwen36-axq
lms ps
```

`lms ps` should show 24.40 GB – the text backbone alone – with a 128K context and the TTL counting down. Two of those flags matter more than they look:

- `--parallel 2` is required. LM Studio defaults to **four** request slots, and four sequences at 128K is about 10 GB of KV cache on top of the weights – right at the wired ceiling. Two matches what I gave mlx-lm.
- `--ttl 3600` unloads the model after an hour idle and hands the 24 GB back to the rest of the machine. mlx-lm has no equivalent; it holds memory until you kill it.

## Which engine? It turns out they're the same engine

I ran a proper A/B between the two, and the first result was alarming: on the same prompt at greedy decoding, LM Studio produced about 2.4 times as much reasoning text as mlx-lm before answering – 2,400 reasoning tokens versus about 1,000. That's a real cost; it would mean every agent turn takes more than twice as long on LM Studio.

Except it wasn't the engine. LM Studio applies a per-model inference preset whose stock values are temperature ≈0.8, top-k 40, and a **repeat penalty of 1.1** – and that preset is *not* overridden by what the client sends in the request. It isn't visible anywhere unless you watch the Developer tab log, which prints the sampling parameters it actually applied. A repeat penalty is particularly bad for agent work: it degrades tables, JSON tool arguments, and repeated identifiers, which is most of what a coding agent emits.

Once I edited the preset to Qwen's published values – temperature 0.6, top-p 0.95, top-k 20, repeat penalty 1.0 (off), presence penalty 0 – and re-ran the greedy comparison, the two engines produced **token-for-token identical** output: 9,375 reasoning characters and 2,160 completion tokens on both, with an empty diff on the content. Which makes sense in hindsight. LM Studio's MLX engine is built on mlx-lm; it's the same generator on the same Metal kernels. The whole difference was the preset.

Two takeaways from that exercise:

1. If you use LM Studio with any agent harness, fix the preset *first*. Nothing you send from the client will override it.
2. A greedy, penalty-pinned response that two independent engines agree on is a great regression fixture. I saved mine, and I re-run the diff after any mlx-lm upgrade or LM Studio update. Identical means nothing moved; a different answer means something changed before I find out inside an agent session.

With the engines proven equivalent, the choice comes down to operations. mlx-lm gives maximum control and the lowest overhead. LM Studio's recent engine adds two things mlx-lm lacks: the KV cache is checkpointed to disk, so it survives a restart, and the TTL unload gives memory back when I walk away. On a laptop that is also my daily driver, those won. **LM Studio is what I run day to day**, with the mlx-lm script kept around for when I want to test something at the command line.

## pi – a harness that respects a small context window

The last piece is the agent itself. The big cloud coding harnesses are wonderful, but they front-load 10K or more tokens of system prompt and tool definitions before you type a word. Against a cloud model with a million-token context that's a rounding error. Against a local model with 128K, where a healthy chunk of that window is the reason I picked this architecture, it's a tax I'd rather not pay on every turn.

[pi](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) is a small, open coding agent for the terminal that keeps its overhead under 1K tokens. It talks to any OpenAI-compatible endpoint, which both of my engines expose. Install it and give it a `models.json`:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
mkdir -p ~/.pi/agent
```

`~/.pi/agent/models.json`, with both engines defined so I can flip between them with `/model`:

```json
{
  "providers": {
    "lmstudio": {
      "baseUrl": "http://127.0.0.1:1234/v1",
      "api": "openai-completions",
      "apiKey": "local",
      "compat": {
        "supportsDeveloperRole": false,
        "supportsStore": false,
        "supportsReasoningEffort": false
      },
      "models": [
        {
          "id": "qwen36-axq",
          "name": "Qwen3.6-35B-A3B AXQ-6bit via LM Studio",
          "contextWindow": 131072,
          "maxTokens": 32768,
          "reasoning": true,
          "input": ["text"],
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    },
    "mlx-local": {
      "baseUrl": "http://127.0.0.1:8080/v1",
      "api": "openai-completions",
      "apiKey": "local",
      "compat": {
        "supportsDeveloperRole": false,
        "supportsStore": false,
        "supportsReasoningEffort": false
      },
      "models": [
        {
          "id": "default_model",
          "name": "Qwen3.6-35B-A3B AXQ-6bit via mlx-lm",
          "contextWindow": 131072,
          "maxTokens": 32768,
          "reasoning": true,
          "input": ["text"],
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    }
  }
}
```

The non-obvious bits of that file, each of which cost me a round of head-scratching:

- **`cost` is required**, even at all zeros. pi's schema validator refuses the file with `must have required properties` if any of the four keys is missing.
- **`compat` flags** stop pi from sending the OpenAI-only `developer` role, `store`, and `reasoning_effort` fields, which the Qwen chat template doesn't understand.
- **`id`** must be the identifier the server knows: `qwen36-axq` is what I passed to `lms load --identifier`, and `default_model` is mlx-lm's alias for whatever it launched with.
- **`contextWindow` of 131072** – Qwen recommends at least 128K to keep thinking quality up, and pi compacts the conversation when this fills, reserving 16K for the reply.
- **`maxTokens` of 32768** matches the server's reply ceiling. Qwen's own guidance for hard problems goes up to 81,920; raise both sides together if you need it, at 20 KB of memory per token.

Then, in a project directory:

```bash
pi --model lmstudio/qwen36-axq
```

Ask it to read a file and summarize the project. You should see tool calls (read, bash) execute and get a coherent answer back. One thing to expect: pi's `/compact` command rewrites the conversation history, and because the DeltaNet layers' cache can't be trimmed, that forces one cold prefill of the new prompt. It's a few seconds, once, and then the prefix cache picks back up. That's expected, not a leak.

## Watching memory

I keep a five-second memory sampler running in a second terminal during real sessions. It's the only way to know whether a configuration is actually safe, as opposed to looking safe for the first ten minutes:

```bash
#!/usr/bin/env bash
# ~/llm/memwatch.sh – system memory + the mlx server's RSS every 5 s. Ctrl-C to stop.
PAGE=$(sysctl -n hw.pagesize)
printf "%-8s %5s %8s %8s %9s %10s\n" time free% wiredGB srvGB swapouts pageouts
while true; do
  PID=$(pgrep -f "mlx_lm.server" | head -1)
  SRV=$([ -n "$PID" ] && ps -o rss= -p "$PID" | awk '{printf "%.1f",$1/1048576}' || echo "-")
  FREE=$(memory_pressure | awk -F': ' '/free percentage/{gsub("%","",$2);print $2}')
  read -r WIRED SWAP PAGEOUT < <(vm_stat | awk -v P="$PAGE" '
     /Pages wired down/ {w=$4} /Swapouts/ {s=$2} /Pageouts/ {p=$2}
     END {gsub("\\.","",w);gsub("\\.","",s);gsub("\\.","",p); printf "%.1f %s %s", w*P/1073741824, s, p}')
  printf "%-8s %5s %8s %8s %9s %10s\n" "$(date +%H:%M:%S)" "$FREE" "$WIRED" "$SRV" "$SWAP" "$PAGEOUT"
  sleep 5
done
```

| Signal | Healthy | Back off when |
|---|---|---|
| `free%` | ≥ 20% | Sits under 10% for more than a minute |
| `wiredGB` | ≈ 27–33 | Creeps toward 36 with the model idle – something else grabbed GPU memory |
| `srvGB` | ≈ 25–31 | Grows past 33 – prompt cache or concurrency set too high |
| `swapouts` | flat | Increases *at all* while the model is loaded – this is the hard line |

If swapouts tick up, the fix is always to shrink something the server owns – never to raise the wired limit. In rough order of how much they cost:

| Symptom | Change |
|---|---|
| Swapouts rising in long sessions | `--prompt-cache-bytes 2000000000`, `--prompt-cache-size 3` |
| Still tight | pi `contextWindow` down to 65536 (saves ≈1.3 GB per active sequence) |
| Still tight | Switch to a 4-bit build (≈19–20 GB of weights) |
| Two pi subagents stall each other | `--decode-concurrency 3` (+2.5 GB per extra sequence at 128K) |
| Replies cut off mid-task | `--max-tokens 65536` plus a matching pi `maxTokens` |
| Chat use, speed over depth | `--chat-template-args '{"enable_thinking":false}'` |

Everything here is reversible in under a minute – `pkill -f mlx_lm.server`, `lms unload --all` – and nothing touches LM Studio's model files, the system Python, or any persistent kernel setting.

## Where I landed

I now have a coding agent that runs entirely on my laptop, decodes at 50-plus tokens per second, handles tool calls correctly, and carries a 128K context – all inside 33 GB, with the machine still usable for everything else. It is not a frontier model. For hard design problems I still reach for the cloud. But for the day-to-day loop of "read this, explain that, make this change and run the tests," it's genuinely useful, it costs nothing per token, and nothing leaves the machine.

If I had to boil the whole exercise down: on a mid-sized Mac, spend your memory on a Mixture-of-Experts model with a hybrid attention architecture, so that both the parameters and the context are cheap; check which engine defaults are silently applying before you compare anything; and pick a harness that doesn't spend your context window before you do. If you're contemplating a similar setup, I hope the details here save you some of the evenings they cost me.

<p align="center" style="font-size:small">hero image by <a href="https://unsplash.com/@alinnnaaaa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alina Grubnyak</a> on <a href="https://unsplash.com/photos/low-angle-photography-of-metal-structure-ZiQkhI7417A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</p>
