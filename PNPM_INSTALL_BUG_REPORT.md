# Bug Report: `pnpm install` Fails to Create Binary Links on Windows

## Summary

When running `pnpm install` in a monorepo on a specific Windows environment, the command completes but fails to create the necessary binary symlinks in the `node_modules/.bin` directories of the workspaces. This prevents scripts that rely on these binaries (like `tsc`, `eslint`, etc.) from running, failing with a "command not found" error.

The root cause appears to be a bug in pnpm where it incorrectly constructs a file path, attempting to find a non-existent file named `node.exe.EXE` (with a double `.EXE` extension).

## Environment Details

| Component      | Version      |
|----------------|--------------|
| Operating System| Windows (win32)|
| Node.js        | `v22.19.0`   |
| pnpm           | `v10.18.1`   |

## Steps to Reproduce

1. On a clean Windows machine with the environment specified above, clone the repository.
2. Navigate to the project root directory.
3. Run the command `pnpm install`.

## Expected Behavior

`pnpm install` should complete successfully, and the `node_modules/.bin` directory within each workspace (e.g., `apps/backend/node_modules/.bin`) should be populated with executable symlinks to the installed tools, such as `tsc`.

## Actual Behavior

The `pnpm install` command finishes with an exit code of 0, but it logs multiple warnings indicating a failure to create binaries. The `node_modules/.bin` directories in the workspaces remain empty.

### Key Error from Logs

The most telling error message observed during the installation process is:

```
WARN Failed to create bin at C:\Projeler\YBIS\packages\core\node_modules\.bin\node. ENOENT: no such file or directory, stat 'C:\Projeler\YBIS\packages\core\node_modules\@types\node\node.exe.EXE'
```

This warning is repeated for multiple workspaces.

## Analysis

The error `stat '...\node.exe.EXE'` is the critical piece of evidence. It shows that `pnpm` is erroneously appending an extra `.EXE` suffix when it tries to create a `node` executable shim. This is likely a bug within `pnpm v10.18.1` related to path resolution or binary creation specifically on the Windows platform, possibly triggered by the Node.js version.

All attempts to resolve this through clean installs (deleting `node_modules`, `pnpm-lock.yaml`, and pruning the store) resulted in the exact same error, confirming that the issue is deterministic and not related to a corrupted state.
