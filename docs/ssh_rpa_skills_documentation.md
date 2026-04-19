## 7. Skill: `ssh-op`

*   **Description:** A helper script that integrates 1Password with `ssh-agent` to securely load SSH private keys for non-interactive SSH connections. It ensures an `ssh-agent` is running, loads a specified SSH key from 1Password, and then executes `ssh` with your arguments. This is crucial for secure, automated SSH access in RPA scenarios.
*   **GitHub Repository (part of):** `https://github.com/openclaw/skills/tree/main/skills/moodykong/ssh-op`

### Installation Steps (for OpenClaw)

1.  **Prerequisites:**
    *   **1Password CLI (`op`)** must be installed and authenticated on the OpenClaw host. Verify its functionality by running `op whoami`.
    *   **SSH client**, **`ssh-agent`**, and **`ssh-add`** utilities must be available on the OpenClaw host.

2.  **Copy the Skill to OpenClaw Workspace:**
    The `ssh-op` skill is located within the `openclaw/skills` repository. Assuming you have cloned `https://github.com/openclaw/skills.git` to your workspace, copy this skill to a dedicated directory in your OpenClaw workspace (e.g., `ssh-op/` at the root of your workspace):
    ```bash
    mkdir -p ssh-op
    cp -r skills/skills/moodykong/ssh-op/* ssh-op/
    ```

3.  **Configure 1Password Integration:**
    Create a `config.env` file within the `ssh-op` directory (e.g., `/Users/jingboss/.openclaw/workspace/ssh-op/config.env`) to specify the 1Password vault and item containing your SSH private key.

    **Example `ssh-op/config.env`:**
    ```env
    SSH_OP_VAULT_NAME="Personal" # Replace with the exact name of your 1Password vault
    SSH_OP_ITEM_TITLE="My SSH Key" # Replace with the exact title of your 1Password item containing the SSH key
    # Optional: SSH_OP_KEY_FIELD="private key" # Default field name for the private key within the 1Password item
    # Optional: SSH_OP_KEY_FINGERPRINT_SHA256="..." # If set, `ssh-op` will skip re-loading the key if already in `ssh-agent`
    # Optional: SSH_OP_HOSTS_FILE="hosts.conf" # Custom filename for SSH host entries
    ```

4.  **Optional: Create Symlink for Convenience:**
    For easier command invocation, it is recommended to create a symbolic link to the `ssh-op` script in a directory that is included in your system's `PATH` (e.g., `~/.local/bin`):
    ```bash
    mkdir -p ~/.local/bin
    ln -sf /Users/jingboss/.openclaw/workspace/ssh-op/scripts/ssh-op ~/.local/bin/ssh-op
    ```
    Ensure that `~/.local/bin` (or your chosen directory) is added to your shell's `PATH` environment variable.

5.  **Optional: Manage `~/.ssh/config` Host Aliases:**
    You can define custom SSH host entries in the `ssh-op/hosts.conf` file (within the skill directory) and then use the provided Python script to idempotently add or update these entries in your main `~/.ssh/config` file. This script manages a specific block in `~/.ssh/config`:
    ```bash
    /Users/jingboss/.openclaw/workspace/ssh-op/scripts/ensure_ssh_config.py
    ```

6.  **Integrate with OpenClaw:**
    Once `ssh-op` is configured, OpenClaw can use its `exec` tool to run commands that leverage `ssh-op` for secure SSH connections.

    **Examples of OpenClaw interacting with `ssh-op`:**
    *   **Establish an SSH connection to a defined host alias:**
        ```bash
        exec command="/Users/jingboss/.openclaw/workspace/ssh-op/scripts/ssh-op my-host-alias"
        # If symlinked, you can use:
        # exec command="ssh-op my-host-alias"
        ```
    *   **Execute a remote command on a host using a 1Password-managed key:**
        ```bash
        exec command="/Users/jingboss/.openclaw/workspace/ssh-op/scripts/ssh-op my-host-alias 'ls -la /var/log'"
        ```

---
