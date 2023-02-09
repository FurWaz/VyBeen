class SongController {
    static _instance = null;
    /**
     * @returns {SongController}
     */
    static get instance () {
        if (this._instance == null)
            this._instance = new SongController();
        return this._instance;
    }

    constructor(song) {
        this.song = song;
    }
    
    play() {
        if (this.song == null) return;
        if (this.song.isPlaying) return;
        this.song.play();
    }
    
    pause() {
        if (this.song == null) return;
        if (!this.song.isPlaying) return;
        this.song.pause();
    }

    setSong(song) {
        this.song = song;
    }
}

export default SongController;