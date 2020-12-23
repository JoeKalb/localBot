module.exports = {
    keyword:"",
    users: new Set(),
    allowEntries: false,
    channel: "",
    count: 0,
    start: function(newChannel, newKeyword){
      this.channel = newChannel;
      this.keyword = newKeyword;
      this.allowEntries = true;
    },
    setKeyword: function(newKeyword){
        this.keyword = newKeyword.toLowerCase()
    },
    getKeyword: function(){
        return this.keyword
    },
    hasKeyword: function(word){
        return word.contains(this.keyword)
    },
    isNewName: function(name){
      if(!this.users.has(name)){
        this.users.add(name)
        ++this.count
      }
    },
    check: function(name) {
      return this.users.has(name);
    },
    stopEntries: function(){
      this.allowEntries = false;
    },
    drawWinner:function(){
      this.allowEntries = false;
      let names = Array.from(this.users)
      let winner = names[Math.floor(Math.random() * this.count)]
      this.users.delete(winner)
      --this.count
      return winner
    },
    clear:function(){
      this.users.clear()
      this.channel = ""
      this.allowEntries = false;
      this.keyword = ""
    }
}