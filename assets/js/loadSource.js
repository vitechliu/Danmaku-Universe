var Source = function() {
    var source = this;
    this.image = {};
    for (var w in standardWeapon) {
        var i = new Image();
        i.src = "game/weapon/icon/"+decodeURI(w)+".png";
        source.image[standardWeapon[w].name] = i;
    }
    var i = new Image();
    i.src = "game/weapon/icon/none.png";
    source.image["none"] = i;
}