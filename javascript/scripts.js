function setInputToValueHrTweaks(elem_id, value) {
    const input = gradioApp().querySelector("#" + elem_id + " input");
    input.value = value;
    updateInput(input);
}

function bindHrTweaksRawPromptProxy() {
    const app = gradioApp();
    if (!app) return;

    const proxyRoot = app.querySelector("#script_txt2img_hires_fix_tweaks_hr_raw_prompt_proxy");
    const targetRoot = app.querySelector("#hires_prompt_raw");
    const modeRow = app.querySelector("#script_txt2img_hires_fix_tweaks_hr_prompt_mode_row");

    if (!proxyRoot || !targetRoot || !modeRow) return;

    const proxyInput = proxyRoot.querySelector('input[type="checkbox"]');
    const targetInput = targetRoot.querySelector('input[type="checkbox"]');

    if (!proxyInput || !targetInput) return;

    const targetContainer =
        targetRoot.closest(".form") ||
        targetRoot.closest(".gradio-checkbox") ||
        targetRoot.parentElement;
    if (targetContainer) {
        targetContainer.style.display = "none";
    }

    if (modeRow.parentElement) {
        modeRow.parentElement.style.flexWrap = "wrap";
    }

    if (proxyRoot.dataset.hrTweaksRawBound === "true") return;

    const syncState = (source, target, triggerUpdate) => {
        if (target.checked === source.checked) return;
        target.checked = source.checked;

        if (triggerUpdate) {
            if (typeof updateInput === "function") {
                updateInput(target);
            } else {
                target.dispatchEvent(new Event("input", { bubbles: true }));
                target.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    };

    syncState(targetInput, proxyInput, false);

    proxyInput.addEventListener("change", () => {
        syncState(proxyInput, targetInput, true);
    });

    targetInput.addEventListener("change", () => {
        syncState(targetInput, proxyInput, false);
    });

    proxyRoot.dataset.hrTweaksRawBound = "true";
}

onUiLoaded(bindHrTweaksRawPromptProxy);
onAfterUiUpdate(bindHrTweaksRawPromptProxy);
