import getMeme, { getList, getTypes } from "../src";

(async () => {
    const meme = await getMeme({ type: "meme" });
    console.log("meme: ", meme);

    const wall = await getMeme({ type: "wallpaper" });
    console.log("wall: ", wall);

    try {
        // will sometimes throw because not everything in r/outrun is an image
        const custom = await getMeme({
            type: "custom",
            addSubs: ["outrun"],
        });
        console.log("custom: ", custom);
    } catch {
        console.log("r/outrun request did not return image");
    }

    console.log("--- --- ---\n");

    console.log("meme list: " + getList("meme").join(", "));

    // @ts-ignore (ignored because this WILL be undefined)
    console.log("fake list: " + getList("fgjoihfgg")?.join(", "));

    console.log("--- --- ---\n");

    console.log("types: " + getTypes().join(", "));
})();
