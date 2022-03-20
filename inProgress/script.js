onload = () => {
    const back = document.getElementById("background");
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const p = document.createElement("p");
            const rand = Math.random();
            p.classList.add("floating");
            p.innerHTML = ["♪", "♫", "𝄞", "𝄰"][Math.floor(Math.random()*4)];
            p.style.opacity = (rand*0.6).toString();
            p.style.fontSize = (rand*20+30)+"px";
            p.style.left = Math.random() * window.innerWidth+"px";
            p.style.top = Math.random() * window.innerHeight+"px";
            setInterval(() => {
                p.style.transform = "translate("+(Math.random()*20-10)+"px, "+(Math.random()*20-10)+"px)";
            }, 2050);
            back.appendChild(p);
        }, i*20);
    }
};