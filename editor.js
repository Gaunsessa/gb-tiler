class Color {
   r = 0;
   g = 0;
   b = 0;

   constructor(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
   }

   static fromHex(hex) {
      if (hex.startsWith("#"))
         hex = hex.slice(1);

      return new Color(
         parseInt(hex.slice(0, 2), 16),
         parseInt(hex.slice(2, 4), 16),
         parseInt(hex.slice(4, 6), 16)
      );
   }

   toHex = () => {
      return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
   }
}

class PixelCanvas {
   canvas = null;
   ctx    = null;

   width  = 1;
   height = 1;

   mpos = [0, 0];

   constructor(canvas, width, height) {
      this.canvas = canvas;
      this.width  = width;
      this.height = height;

      this.canvas.width = width;
      this.canvas.height = height;

      this.ctx = canvas.getContext("2d");

      // mpos
      this.canvas.addEventListener("mousemove", event => {
         let elmRect = this.canvas.getBoundingClientRect();

         this.mpos = [
            Math.floor(((event.x - elmRect.x) / elmRect.width) * this.width),
            Math.floor(((event.y - elmRect.y) / elmRect.height) * this.height)
         ];
      });
   }

   put = (x, y, color, alpha = 255) => {
      this.ctx.fillStyle = color.toHex() + alpha.toString(16);
      this.ctx.fillRect(x, y, 1, 1);
   }

   fill = (x, y, width, height, color) => {
      this.ctx.fillStyle = color.toHex();
      this.ctx.fillRect(x, y, width, height);
   }

   fillImage = (x, y, img) => {
      for (y in img)
         for (x in img[y])
            this.put(x, y, img[y][x]);
   }
}

class Editor {
   canvas  = null;
   image   = [];
   palette = []


   constructor(canvas) {
      this.canvas = canvas;

      // this.image = new Array(this.canvas.height).fill(new Array(this.canvas.width).fill(Color.fromHex("#2F5AAC")));
      // Can't do line above because cloneing and bullshit
      for (let y = 0; y < this.canvas.height; y++) {
         this.image.push([]);

         for (let x = 0; x < this.canvas.width; x++)
            this.image[y].push(Color.fromHex("#2F5AAC"));
      }

      // Bind basic listeners
      this.canvas.canvas.onmousemove = this.mouseMove;
      this.canvas.canvas.onmousedown = this.mouseDown;
      this.canvas.canvas.onmouseup   = this.mouseUp;
   }

   update = () => {
      this.canvas.fillImage(0, 0, this.image);
   }

   mouseMove = event => {
      this.image[this.canvas.mpos[1]][this.canvas.mpos[0]] = Color.fromHex("#FFFFFF");
      this.update();

      // Cursor highlight
      this.canvas.put(this.canvas.mpos[0], this.canvas.mpos[1], Color.fromHex("#FFFFFF"), 60);
   }

   mouseDown = event => {
      console.log(this);
      this.image[this.canvas.mpos[1]][this.canvas.mpos[0]] = Color.fromHex("#FFFFFF");

      this.update();
   }

   mouseUp = event => {

   }
}

new Editor(new PixelCanvas(document.querySelector("#editor", 256, 256), 256, 256)).update()
// console.log(color.fromHex("#FF0022"))