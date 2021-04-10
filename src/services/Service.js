export const GetStories = () => {
    return fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
        .then(res => res.json())
        .then(
            (result) => {
                return result;
            })
}

export const GetStoryById = (id) => {
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
}