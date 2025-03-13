let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        mobe: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

let draw = false;
let erase = false;

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

gridButton.addEventListener("click", () => {
    container.innerHTML = "";
    let count = 0;
    for (let i = 0; i < gridHeight.value; i++) {
        count += 2;
        let div = document.createElement("div");
        div.classList.add("gridRow");

        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.setAttribute("id", `gridCol${count}`);
            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                if (erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id;
                checker(elementId);
            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            div.appendChild(col);

        }

        container.appendChild(div);

    }
});

function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((element) => {
        if (elementId == element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent";
            }
        }
    });
}

clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});

eraseBtn.addEventListener("click", () => {
    erase = true;
});

paintBtn.addEventListener("click", () => {
    erase = false;
});

gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

let randomColorButton = document.getElementById("random-color");
randomColorButton.addEventListener("click", () => {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((col) => {
        col.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    });
});

let counter = document.getElementById("color-counter");
setInterval(() => {
    let gridColumns = document.querySelectorAll(".gridCol");
    let coloredCount = Array.from(gridColumns).filter(
        (col) => col.style.backgroundColor && col.style.backgroundColor !== "transparent"
    ).length;
    counter.innerHTML = `Colored Cells: ${coloredCount}`;
}, 500);

let gradientButton = document.getElementById("gradient-btn");
gradientButton.addEventListener("click", () => {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((col, index) => {
        col.style.backgroundColor = `hsl(${index * 10}, 80%, 70%)`;
    });
});

let fillGridButton = document.getElementById("fill-grid");
fillGridButton.addEventListener("click", () => {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((col) => {
        col.style.backgroundColor = colorButton.value;
    });
});

document.getElementById("save-image").addEventListener("click", () => {
    html2canvas(container).then((canvas) => {
        let link = document.createElement("a");
        link.download = "grid-image.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});

let messageBox = document.getElementById("welcome-message");

function showMessage(message) {
    messageBox.innerHTML = message; // تعيين الرسالة
    messageBox.style.display = "block"; // إظهار الرسالة
    setTimeout(() => {
        messageBox.style.display = "none"; // إخفاء الرسالة بعد 3 ثوانٍ
    }, 3000);
}

// مثال: إضافة رسالة عند النقر على زر الرسم
paintBtn.addEventListener("click", () => {
    showMessage("مرحبًا بك! يمكنك الآن بدء الرسم 😊");
});

// مثال: إضافة رسالة عند النقر على زر المسح
eraseBtn.addEventListener("click", () => {
    showMessage("أنت الآن في وضع المسح. امسح الخلايا التي ترغب بها!");
});

let audio = new Audio("audio/سورة محمد بصوت احمد السيد.mp3");

container.addEventListener("click", () => {
    audio.play();
});


window.onload = () => {
    gridHeight.value = 0;
    gridWidth.value = 0;
};