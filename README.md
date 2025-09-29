# Hollow Knight WebGL – Save/Load Overlay

This export contains a small, non-invasive Save/Load overlay injected into `index.html` to enable file-based saving compatible with static hosts (including Google Sites, GitHub Pages, etc.). It mirrors the workflow from the Unity-side instructions without requiring the original Unity project rebuild.

## What was added
- A floating Save/Load bar in the top-left of the page (press `H` to hide/show).
- JavaScript helpers that:
  - Save: downloads a `save.json` file with an example payload.
  - Load: lets the player select a `save.json` and forwards it to Unity if the build exposes `GameManager.LoadGameFromJSON`.

If your Unity build includes a `SaveManager` MonoBehaviour with `LoadGameFromJSON(string json)` on a `GameObject` named `GameManager`, the loaded JSON will be delivered to it automatically.

## Limitations
Without the Unity project, we cannot add the `.jslib` plugin or C# scripts into the built output. The overlay provides the next-best option:
- File export/import entirely in the browser.
- Optional forwarding to Unity via `unityInstance.SendMessage('GameManager', 'LoadGameFromJSON', json)` if present in the build.

To fully integrate (recommended), add the following in your Unity project and rebuild WebGL:
- `Assets/Scripts/SaveData.cs` and `Assets/Scripts/SaveManager.cs` from your instructions.
- `Assets/Plugins/saveSystem.jslib` with `DownloadFile` and `UploadFile`.
- Two UI buttons wired to `SaveManager.SaveGame()` and `SaveManager.LoadGame()`.

## Local test
Open `index.html` with a local static server (some browsers block file:// XHR):

- On Windows with PowerShell and Python installed:

```powershell
# From this folder
python -m http.server 8080
```

Then browse to `http://localhost:8080/`.

## Deploy to GitHub Pages
1. Initialize git and push to your repo (replace with your repo URL):

```powershell
git init
git add .
git commit -m "Add Save/Load overlay and helpers"
git branch -M main
git remote add origin https://github.com/j6520445-png/somehting-.git
git push -u origin main
```

2. In the GitHub repo settings, enable Pages for the `main` branch root or `docs/` as preferred.

3. Access the deployed site at the Pages URL. The Save/Load bar should be visible in the top-left.

## Customizing
- Change the default sample save in `index.html` function `buildSampleSaveData()`.
- If your target GameObject or method is different, edit the call inside `loadGameWeb()`:
  `unityInstance.SendMessage('<GameObject>', '<Method>', json)`.
