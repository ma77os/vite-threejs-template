import GUI from "lil-gui";

export const settings = {
	shadowBias: 0,
	shadowNormalBias: 0,
};

export const gui = new GUI({
	width: 300,
});

window.addEventListener("keydown", (event) => {
	if (event.key == "h") gui.show(gui._hidden);
});
