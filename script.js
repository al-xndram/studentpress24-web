document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowRight") {
    if (blue_book.selected()) blue_book.next_page();
    if (green_book.selected()) green_book.next_page();
  }

  if (e.key === "ArrowLeft") {
    if (blue_book.selected()) blue_book.prev_page();
    if (green_book.selected()) green_book.prev_page();
  }
});

let cur_id = 0;
let z = 0;

let blue_dimensions = {
  h: 60,
  r: 0,
  x: 50,
  y: 50,
};

let green_dimensions = {
  h: 80,
  r: 0,
  x: 150,
  y: 100,
};

let blue_book = create_book(blue_dimensions, "blue", 29);
let green_book = create_book(green_dimensions, "green", 21);

function create_book(dimensions, folder, num_pages) {
  let parent = document.createElement("div");
  parent.id = folder + "-book";
  parent.classList.add("fixed-element");
  parent.style.height = dimensions.h + "vh";
  parent.style.transform = `translate(${dimensions.x}px, ${dimensions.y}px) rotate(0deg)`;

  let book_manager = create_manager(folder, num_pages);
  let selected = false;

  let image_viewer = document.createElement("div");
  image_viewer.id = "image-viewer";

  create_draggable(parent);
  add_corners(parent, dimensions);

  parent.appendChild(image_viewer);

  parent.onmouseenter = () => {
    highlight_book(image_viewer);
    selected = true;
  };
  parent.onmouseleave = () => {
    unhighlight_book(image_viewer);
    selected = false;
  };

  document.body.appendChild(parent);

  book_manager.pages.forEach((img) => {
    image_viewer.appendChild(img);
    img.style.display = "none";
  });

  set_image(0, book_manager.pages);

  let is_rotated = () => ((dimensions.r / 180) % 2 === 0 ? true : false);

  return {
    next_page: () =>
      is_rotated() ? next_page(book_manager) : prev_page(book_manager),
    prev_page: () =>
      is_rotated() ? prev_page(book_manager) : next_page(book_manager),
    selected: () => selected,
    set_page: (page) => {
      go_to_page(book_manager, page);
      make_big(parent);
      highlight_book(image_viewer);
    },
  };
}

function highlight_book(parent) {
  z += 1;
  parent.style.boxShadow = "0 0 80px 10px rgba(0, 0, 0, 0.4)";
  parent.parentElement.style.zIndex = z;
}

function unhighlight_book(parent) {
  parent.style.boxShadow = "0 0 50px 10px rgba(0, 0, 0, 0.2)";
}

function make_big(elem) {
  elem.style.height = "100vh";
  elem.style.transition = "all 0.3s";
  elem.style.transform = "translate(10px, 10px)";
}

function make_small(elem, num) {
  elem.style.transition = "height 0.3s";
  elem.style.height = num + "vh";
}

function next_page(book) {
  book.cur += 1;
  if (book.cur >= book.pages.length) {
    book.cur = 0;
  }
  set_image(book.cur, book.pages);
}

function prev_page(book) {
  book.cur -= 1;
  if (book.cur < 0) {
    book.cur = book.pages.length - 1;
  }

  set_image(book.cur, book.pages);
}

function go_to_page(book, page) {
  book.cur = page;
  set_image(book.cur, book.pages);
}

function add_corners(elem, dimensions) {
  // add 10px divs to each corner of the element
  let corners = ["top-left", "top-right"];
  corners.forEach((corner) => {
    let corner_div = document.createElement("div");
    corner_div.classList.add("corner", corner);
    corner_div.style.width = "10px";
    corner_div.style.height = "10px";
    corner_div.style.position = "absolute";

    //position each of them in absolute position
    if (corner === "top-left") {
      corner_div.style.top = "0px";
      corner_div.style.left = "0px";

      let max = document.createElement("span");
      max.innerText = "⤡";

      max.onclick = function(e) {
        e.stopPropagation();

        if (max.innerText === "⤡") {
          make_big(elem);
          max.innerText = "⤥";
        } else {
          make_small(elem, dimensions.h);
          max.innerText = "⤡";
        }
      };

      let min = document.createElement("span");
      min.innerText = "↴";

      min.onclick = function(e) {
        e.stopPropagation();
        let h = window.innerHeight;

        if (min.innerText === "↴") {
          elem.style.transition = "all 0.3s";
          elem.style.transform = `translate(${dimensions.x}px, ${h - 50}px)`;
          min.innerText = "↑";
        } else {
          elem.style.transition = "all 0.3s";
          elem.style.transform = `translate(${dimensions.x}px, ${dimensions.y}px)`;
          min.innerText = "↴";
        }
      };

      corner_div.appendChild(max);
      corner_div.appendChild(min);
    }

    if (corner === "top-right") {
      corner_div.style.top = "0px";
      corner_div.style.right = "0px";
      corner_div.innerText = "⟳";

      corner_div.onclick = function(e) {
        e.stopPropagation();
        dimensions.r += 180;

        let els = elem.childNodes;
        let el;

        els.forEach((e) => {
          if (e.id === "image-viewer") {
            el = e;
          }
        });

        update_rotation(el, dimensions.r);
      };
    }

    corner_div.style.cursor = "pointer";

    elem.appendChild(corner_div);
  });
}

function create_draggable(draggable_elem) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  draggable_elem.addEventListener("pointerdown", function(e) {
    isDragging = true;
    offsetX = e.clientX - draggable_elem.getBoundingClientRect().left;
    offsetY = e.clientY - draggable_elem.getBoundingClientRect().top;
  });

  draggable_elem.addEventListener("pointermove", function(e) {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    update_position(draggable_elem, x, y);
  });

  draggable_elem.addEventListener("pointerup", function() {
    isDragging = false;
  });

  draggable_elem.addEventListener("onmouseleave", function() {
    isDragging = false;
  });
}

function update_position(elem, x, y) {
  elem.style.transition = "transform 0s";
  elem.style.transform = `translate(${x}px, ${y}px)`;
}

function update_rotation(elem, r) {
  elem.style.transition = "transform 0.3s";
  // let existing_transform = elem.style.transform;
  // let transform = existing_transform.split(" rotate(")[0];
  elem.style.transform = `rotate(${r}deg)`;
}

function add_pages(folder, num_pages, pages) {
  for (let i = 1; i <= num_pages; i++) {
    pages.push(`./${folder}/${i}.png`);
  }

  pages = pages.map((img) => {
    const image = new Image();
    image.src = img;
    image.draggable = false;
    return image;
  });

  return pages;
}

function create_manager(folder, num_pages) {
  return {
    pages: add_pages(folder, num_pages, []),
    cur: 0,
  };
}

function set_image(id, pages) {
  pages.forEach((img) => {
    img.style.display = "none";
  });
  pages[id].style.display = "block";
}
