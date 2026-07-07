## 1. Async worker loop

- [x] 1.1 Extract `run_iteration()` (single poll cycle) from `run()`'s while-loop body
- [x] 1.2 Add `run_forever_async()` using `asyncio.to_thread` + `asyncio.sleep`
- [x] 1.3 Keep `run()` / `if __name__ == "__main__"` unchanged for standalone use

## 2. Wire into FastAPI

- [x] 2.1 Add `lifespan` to `main.py` starting `run_forever_async()` as a background task
- [x] 2.2 Gate behind `ENABLE_BACKGROUND_WORKER=true` env var (default off)
- [x] 2.3 Cancel the task on shutdown

## 3. Deployment config

- [x] 3.1 Remove the `worker` service from `render.yaml`
- [x] 3.2 Add `ENABLE_BACKGROUND_WORKER=true` to the `web` service's env vars

## 4. Verification

- [x] 4.1 Full backend test suite passes unchanged (46/46) with `ENABLE_BACKGROUND_WORKER` unset
- [ ] 4.2 After Render deploy: confirm content saved via the app actually gets processed (status moves pending → ready) without a separate worker service
