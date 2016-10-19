var standardItem = {
    item_weapon:{
        name:"weapon",
        shape:"circle",
        size:10, //大致半径，用于准心
        radius:10,
        icon:"weapon.png",
        color:"rgba(255,255,255,",
        useFunc : function(tadpole,detail,model) { //返回true或false决定是否die
            if(tadpole.nextSlot!=0) {
                tadpole.equip(new Weapon(detail.weapon,tadpole),tadpole.nextSlot,model);
                return true;
            } else {
                return false;
            }
        },
    }
}