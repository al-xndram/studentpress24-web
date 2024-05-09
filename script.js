let image_viewer = document.createElement("div");
let rotation = 0;

let cur_id = 0;

document.addEventListener("DOMContentLoaded", function () {
  const draggableElement = document.querySelector("#draggableElement");
  create_draggable(draggableElement, draggableElement);

  image_viewer.id = "image-viewer";

  draggableElement.appendChild(image_viewer);
  image_viewer.innerHTML = "";

  draggableElement.onmouseenter = function (e) {
    draggableElement.style.border = "1px solid red";
  };

  draggableElement.onmouseleave = function (e) {
    draggableElement.style.border = "none";
  };

  blue_book_imgs.forEach((img) => {
    image_viewer.appendChild(img);
    img.style.display = "none";
  });
  set_image(0);

  add_corners(draggableElement, draggableElement);
});

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    increment_image();
  }

  if (e.key === "ArrowLeft") {
    decrement_image();
  }
});

function set_image(id) {
  blue_book_imgs.forEach((img) => {
    img.style.display = "none";
  });
  blue_book_imgs[id].style.display = "block";
  // image_viewer.innerHTML = "";
  // image_viewer.appendChild(blue_book_imgs[id]);
}

function increment_image() {
  cur_id += 1;
  if (cur_id >= blue_book_imgs.length) {
    cur_id = 0;
  }
  set_image(cur_id);
}

function decrement_image() {
  cur_id -= 1;
  if (cur_id < 0) {
    cur_id = blue_book_imgs.length - 1;
  }
  set_image(cur_id);
}

let blue_book_imgs = [];

for (let i = 1; i <= 29; i++) {
  blue_book_imgs.push(`./blue/${i}.png`);
}

blue_book_imgs = blue_book_imgs.map((img) => {
  const image = new Image();
  image.src = img;
  image.draggable = false;
  return image;
});

function add_corners(elem, parent) {
  // add 10px divs to each corner of the element
  let corners = ["top-left", "top-right"];
  corners.forEach((corner) => {
    let corner_div = document.createElement("div");
    corner_div.classList.add("corner", corner);
    corner_div.style.width = "10px";
    corner_div.style.height = "10px";
    corner_div.style.position = "absolute";
    corner_div.style.backgroundColor = "red";
    corner_div.onclick = function (e) {
      e.stopPropagation();
      rotation += 180;
      update_rotation(parent, rotation);
    };
    //position each of them in absolute position

    if (corner === "top-left") {
      corner_div.style.top = "0px";
      corner_div.style.left = "0px";
    }

    if (corner === "top-right") {
      corner_div.style.top = "0px";
      corner_div.style.right = "0px";
    }

    if (corner === "bottom-left") {
      corner_div.style.bottom = "0px";
      corner_div.style.left = "0px";
    }

    if (corner === "bottom-right") {
      corner_div.style.bottom = "0px";
      corner_div.style.right = "0px";
    }

    corner_div.style.cursor = "pointer";

    elem.appendChild(corner_div);
  });
}

function create_draggable(dragable_elem, draggable_part) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  draggable_part.addEventListener("pointerdown", function (e) {
    isDragging = true;
    offsetX = e.clientX - dragable_elem.getBoundingClientRect().left;
    offsetY = e.clientY - dragable_elem.getBoundingClientRect().top;
  });

  draggable_part.addEventListener("pointermove", function (e) {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    r = rotation;

    update_position(dragable_elem, x, y, r);
  });

  draggable_part.addEventListener("pointerup", function () {
    isDragging = false;
  });

  draggable_part.addEventListener("onmouseleave", function () {
    isDragging = false;
  });
}

function update_position(elem, x, y, r) {
  elem.style.transition = "transform 0s";
  elem.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
}

function update_rotation(elem, r) {
  elem.style.transition = "transform 0.05s";
  let existing_transform = elem.style.transform;
  let transform = existing_transform.split(" rotate(")[0];
  elem.style.transform = `${transform} rotate(${r}deg)`;
}
