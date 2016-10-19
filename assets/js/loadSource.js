var Source = function() {
    var source = this;
    this.image = {};
    for (var w in standardWeapon) {
        var i = new Image();
        i.src = "game/weapon/icon/"+decodeURI(w)+".png";
        source.image[standardWeapon[w].name] = i;
    }
    for (var w in standardItem) {
        var i = new Image();
        i.src = "game/item/icon/"+decodeURI(w)+".png";
        source.image[standardItem[w].name] = i;
    }
    var i = new Image();
    i.src = "game/weapon/icon/none.png";
    source.image["none"] = i;
}