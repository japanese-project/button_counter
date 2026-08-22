# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.0 create --template minimal --types ts --add prettier --install npm button-counter
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# GitHub Collaboration Guide

Follow these steps when working on an issue.

## 1. Get the Latest Code

If you don't have the project yet, clone it:

```bash
git clone <repository-url>
cd <project-folder>
```

If you already have the project, get the latest code:

```bash
git checkout main
git pull origin main
```

## 2. Create a Branch

Create a new branch based on your issue.

**Branch naming convention:**

```text
feature/issue-<issue-number>-<short-description>
```

Example:

```bash
git checkout -b feature/issue-12-button-counter
```

## 3. Work on Your Task

Implement the task described in the GitHub Issue.

Check your changes:

```bash
git status
```

## 4. Commit Your Changes

Add your changes:

```bash
git add .
```

Commit them:

```bash
git commit -m "issue-number: implement button counter"
```

## 5. Push Your Branch

Push your branch to GitHub:

```bash
git push -u origin feature/issue-12-button-counter
```

## 6. Create a Pull Request

Go to the GitHub repository.

1. Open **Pull Requests**
2. Click **New Pull Request**
3. Select your branch
4. Set the base branch to `main`
5. Add a short description
6. Click **Create Pull Request**

## 7. Code Review

The team leader will review your Pull Request.

If changes are requested:

```bash
# Make the requested changes

git add .
git commit -m "issue-number: address review comments"
git push
```

The Pull Request will automatically update.

### Quick Workflow

```text
Issue
  ↓
Pull latest main
  ↓
Create branch
  ↓
Do the task
  ↓
Commit
  ↓
Push branch
  ↓
Create Pull Request
  ↓
Leader reviews
  ↓
Merge
```

> **Important:** Do not work directly on `main`. Always create a branch for your issue.
