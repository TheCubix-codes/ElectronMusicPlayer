class Playlist
{

  constructor()
  {
    this.list = ["../assets/sounds/music/2.mp3","../assets/sounds/music/1.mp3"];
    this.current = 0;
  }
  next()
  {
    return this.list[++this.current];
  }
  previews()
  {
    return this.list[--this.current];
  }
}
module.exports = Playlist;
