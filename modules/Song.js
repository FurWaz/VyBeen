class Song {
    constructor(title, artist, duration) {
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.isPlaying = false;

        this.startDate = null;
        this.pause_date = null;
    }

    get progress() {
        if (this.isPlaying) {
            return Date.now() - this.startDate;
        } else {
            return this.pause_date - this.startDate;
        }
    }

    play() {
        this.isPlaying = true;
        if (this.pause_date != null) {
            this.startDate += Date.now() - this.pause_date;
            this.pause_date = null;
        } else {
            this.startDate = Date.now();
        }
    }

    pause() {
        this.isPlaying = false;
        this.pause_date = Date.now();
    }
}

export default Song;