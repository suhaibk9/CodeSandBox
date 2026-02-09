# ============================================
# CODESANDBOX TERMINAL CONTAINER DOCKERFILE
# ============================================
# This Dockerfile creates an Ubuntu-based container for running
# user code in an isolated sandbox environment. Each user terminal
# session runs inside one of these containers.
#
# Security Considerations:
# - Runs as non-root 'sandbox' user for security
# - Isolated from host system (only mounted project directory)
# - Limited to what's installed in this image
#
# Usage:
# This image is built and used by dockerode in handleContainerCreate.js
# to create container instances for terminal sessions.

# ============================================
# BASE IMAGE
# ============================================
# Use Ubuntu 22.04 LTS as the base image
# - LTS = Long Term Support (stable, well-maintained)
# - Familiar environment for developers
# - Good package availability
FROM ubuntu:22.04

# ============================================
# ENVIRONMENT CONFIGURATION
# ============================================
# DEBIAN_FRONTEND=noninteractive prevents apt from prompting for user input
# This is essential for automated builds (Docker can't respond to prompts)
ENV DEBIAN_FRONTEND=noninteractive

# ============================================
# CREATE NON-ROOT USER
# ============================================
# Create a non-root user named 'sandbox' for security
# -m: Create home directory (/home/sandbox)
# -s: Set login shell to /bin/bash
#
# Running containers as root is a security risk because:
# - Root in container can potentially escape to host
# - Accidents can affect the entire container
# - Best practice is principle of least privilege
RUN useradd -ms /bin/bash sandbox

# ============================================
# INSTALL PACKAGES
# ============================================
# Install essential packages:
# - curl: For downloading files and Node.js setup script
# - nano: Simple text editor for users who prefer it
# - nodejs: Node.js runtime (LTS version via nodesource)
#
# apt clean: Remove cached package files to reduce image size
RUN apt update && \
    apt install -y curl nano && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt install -y nodejs && \
    apt clean

# ============================================
# SET WORKING DIRECTORY
# ============================================
# Set the default working directory when the container starts
# The mounted project will appear at /home/sandbox/code
# (configured in handleContainerCreate.js via Binds)
WORKDIR /home/sandbox

# ============================================
# CONFIGURE SHELL PROMPT
# ============================================
# Configure a nice terminal prompt for better UX
# PS1 is the primary prompt string in bash
# \w: Current working directory (full path)
# \$: Shows $ for regular users, # for root
#
# Example prompt: /home/sandbox/code$ 
RUN echo "PS1='\w\\$ '" >> /home/sandbox/.bashrc

# ============================================
# SWITCH TO NON-ROOT USER
# ============================================
# Switch to the sandbox user for all subsequent commands
# and when the container starts
USER sandbox

# ============================================
# DEFAULT COMMAND
# ============================================
# Start an interactive bash shell when the container runs
# This is what users interact with through the WebSocket terminal
CMD ["/bin/bash"]
