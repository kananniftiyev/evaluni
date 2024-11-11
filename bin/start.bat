#!/bin/bash

# Color codes for styling
RESET="\033[0m"
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
MAGENTA="\033[35m"
BLUE="\033[34m"

# Get the project root directory (1 folder before db.json)
ROOT_DIR="$(dirname "$(realpath "$0")")/.."

# Navigate to the root folder where db.json is located
cd "$ROOT_DIR" || { echo -e "${RED}Failed to change directory to $ROOT_DIR${RESET}"; exit 1; }

# Ensure that Deno is installed
echo -e "${CYAN}${BOLD}Checking if Deno is installed...${RESET}"

if ! command -v deno &> /dev/null
then
    echo -e "${RED}Deno is not installed. Installing Deno...${RESET}"
    curl -fsSL https://deno.land/x/install/install.sh | sh
    echo -e "${GREEN}Deno has been installed.${RESET}"
else
    echo -e "${GREEN}Deno is already installed.${RESET}"
fi

# Check Deno version
echo -e "${CYAN}${BOLD}Deno version:${RESET}"
deno --version

# Install Deno packages (if not already installed)
echo -e "${CYAN}${BOLD}Installing Deno packages...${RESET}"
deno install --unstable

# Ensure npx is available
echo -e "${CYAN}${BOLD}Checking if npx is available...${RESET}"

if ! command -v npx &> /dev/null
then
    echo -e "${RED}npx (or npm) is not installed. Please install Node.js and npm.${RESET}"
    exit 1
else
    echo -e "${GREEN}npx is available.${RESET}"
fi

# Run JSON Server (ensure db.json exists)
echo -e "${CYAN}${BOLD}Starting JSON Server...${RESET}"

npx json-server --watch db.json &

# Run the Deno app (assuming "deno task dev" is set up in the deno.json or deno.lock file)
echo -e "${CYAN}${BOLD}Running the app with Deno...${RESET}"
deno task dev
