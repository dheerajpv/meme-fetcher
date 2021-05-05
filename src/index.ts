import fetch from "node-fetch";
import { subreddits, searchTypes } from "./config.json";

/**
 * Options for fetchMeme
 */
interface IOptions {
    /**
     * The type of object to fetch
     */
    type: keyof typeof subreddits | "custom";
    /**
     * Extra subreddits to add
     */
    addSubs?: string[];
    /**
     * Subreddits to remove from default list
     */
    removeSubs?: string[];
    /**
     * Number of posts to return
     */
    count?: number;
}

/**
 * Represents an image post on Reddit.
 * Does not contain even remotely close to all information.
 */
interface IPost {
    subreddit: string;
    author: string;
    nsfw: boolean;
    ups: number;
    title: string;
    spoiler: boolean;
    url: string;
    postLink: string;
    preview: string[];
}

/**
 * Fetches an image post from Reddit.
 * @param options options to fetch
 * @returns A post if only one was requested. An array if there are more
 * @throws Error if recieved post is not an image post or if fetch failed
 */
export default async function fetchMeme({
    type,
    addSubs,
    removeSubs,
    count = 1,
}: IOptions) {
    if (count > 50) {
        throw new TypeError("Max request count is 50");
    } else if (count < 1) {
        console.error(
            "meme-fetcher: WARN, provided count less than 1. Returning 1 item."
        );
        count = 1;
    }

    let subs: string[];

    if (type === "custom") {
        if (!addSubs)
            throw new TypeError("'addSubs' not present in custom type");
        subs = addSubs;
    } else if (type in subreddits) {
        subs = subreddits[type];
        if (addSubs) subs.push(...addSubs);
    } else {
        throw new TypeError(`type ${type} is not a valid type`);
    }

    subs = subs.filter((s) => !removeSubs?.includes(s));

    const results = await getPost(
        subs[Math.floor(Math.random() * subs.length)],
        count
    );

    if (results.length === 1) return results[0];
    return results;
}

async function getPost(sub: string, count: number) {
    try {
        const res = await fetch(
            `https://api.reddit.com/r/${sub}/${
                searchTypes[Math.floor(Math.random() * searchTypes.length)]
            }?limit=${count}`
        );
        const data = await res.json();

        return data.data.children.map((c: any) => {
            const images = c.data.preview.images[0];

            const preview = [
                images.source.url,
                ...images.resolutions.map(({ url }: { url: string }) => url),
            ].map((u) => u.replace(/&amp;/g, "&"));

            return {
                subreddit: c.data.subreddit,
                author: c.data.author_fullname,
                nsfw: c.data.over_18,
                ups: c.data.ups,
                title: c.data.title,
                spoiler: c.data.spoiler,
                url: c.data.url,
                postLink: `https://reddit.com${c.data.permalink}`,
                preview,
            };
        }) as IPost[];
    } catch (e) {
        if (
            e instanceof TypeError &&
            /^Cannot read property '.+' of undefined$/.test(e.message)
        ) {
            throw new Error("Request did not return image");
        }
        throw e;
    }
}

/**
 * Returns the list of subreddits for a given type.
 * @param type type passable to fetchMeme
 * @returns the list of subreddits for that given type
 */
export const getList = (type: keyof typeof subreddits) => subreddits[type];
/**
 * Returns the list of types allowed for use.
 * @returns the types allowed to pass into the other functions
 */
export const getTypes = () => Object.keys(subreddits);
