# VyBeen
Youtube song streaming server made in Node JS

## Routes
### /search?q={QUERY}
Searches for a song on youtube and returns the first result infos
- Results format:
```
{
    "title": "song title",
    "author": "song author",
    "thumbnail": "thumbnail url",
    "length": "song length (seconds)",
    "stream": "api stream route (/stream)",
    "lyrics": "api lyrics route (/lyrics)"
}
```

### /infos
Returns the informations of the current song
- Results format:
```
{
    "title": "song title",
    "author": "song author",
    "thumbnail": "thumbnail url",
    "length": "song length (seconds)",
    "stream": "api stream route (/stream)",
    "lyrics": "api lyrics route (/lyrics)"
}
```

### /stream
Returns the audio stream link of the current song
- Results format:
```
{
    "stream": "stream url",
    "progress": "song current progress (seconds)"
}
```

### /lyrics
Returns the lyrics of the current song
- Results format:
```
{
    "lyrics": [
        "lyrics line 1",
        "lyrics line 2",
        ...
    ]
}
```

You can try VyBeen on my own website [here](https://furwaz.com/vybeen)
And the VyBeen API is available [here](https://vybeen.furwaz.com/)

---
Author: [FurWaz](https://github.com/FurWaz)