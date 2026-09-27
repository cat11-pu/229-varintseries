// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "值 " + (spec.values || []).length + " 个，点按钮编码一遍。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (spec.values || []).forEach(function (value, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "第 " + (spot + 1) + " 个值 " + value;
      row.appendChild(head);
      const bar = document.createElement("span");
      bar.className = "bar";
      const fill = document.createElement("i");
      fill.style.width = Math.min(100, (view.sizes || [])[spot] * 20) + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      const mark = document.createElement("span");
      mark.className = "chip" + (spot + 1 === view.longest_at ? " ok" : "");
      mark.textContent = "差分 " + (view.deltas || [])[spot] + " 用 " + (view.sizes || [])[spot] + " 字节";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "总字节 " + view.bytes_total + "，最长 " + view.longest + " 字节在第 "
      + view.longest_at + " 个值";
    parts.log.textContent = view.count + " 个值，" + (view.roundtrip ? "往返一致" : "往返对不上");
  }

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.value = "70";
  parts.controls.appendChild(valueInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "编码一遍";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一个值";
  addButton.addEventListener("click", function () {
    const next = Number(valueInput.value);
    spec.values = (spec.values || []).concat([Number.isFinite(next) ? next : 0]);
    draw();
  });
  parts.controls.appendChild(addButton);

  const dropButton = document.createElement("button");
  dropButton.textContent = "删最后一个值";
  dropButton.addEventListener("click", function () {
    spec.values = (spec.values || []).slice(0, Math.max(0, (spec.values || []).length - 1));
    draw();
  });
  parts.controls.appendChild(dropButton);

  const flipButton = document.createElement("button");
  flipButton.textContent = "把最后一个值取反";
  flipButton.addEventListener("click", function () {
    const list = spec.values || [];
    if (!list.length) return;
    list[list.length - 1] = -list[list.length - 1];
    draw();
  });
  parts.controls.appendChild(flipButton);

  draw();
}
