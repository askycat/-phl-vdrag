export default  {
	install: function (Vue, options) {
		Vue.directive("drag", {
			bind: function (el, binding) {
				//console.log(binding)
				var postion="fixed";
				if(binding.value.position!==undefined){
					position=binding.value.position
				}
				if(binding.value.zIndex){
					el.style.zIndex= binding.value.zIndex
				}
				var isChildDom
				if (binding.value !== undefined) {
					isChildDom = true
				} else {
					isChildDom = false
				}
				if (/Android|webOS|iPhone|BlackBerry/i.test(navigator.userAgent)) {

					//移动端
					var disX = 0;
					var disY = 0;
					el.addEventListener('touchstart', function (event) {

						//event.preventDefault();//阻止其他事件

						if (event.targetTouches.length == 1) {

							var touch = event.targetTouches[0];  // 把元素放在手指所在的位置

							disX = touch.pageX - el.offsetLeft;   // 鼠标横坐标 - div1的left

							disY = touch.pageY - el.offsetTop;    // 鼠标纵坐标 - div1的top

						}

						el.addEventListener('touchmove', function (event) {

							event.preventDefault();

							// 如果这个元素的位置内只有一个手指的话

							if (event.targetTouches.length == 1) {

								var touch = event.targetTouches[0];  // 把元素放在手指所在的位置

								var x = touch.pageX - disX;

								var y = touch.pageY - disY;

								var window_width = document.documentElement.clientWidth - el.offsetWidth;

								var window_height = document.documentElement.clientHeight - el.offsetHeight;



								x = (x < 0) ? 0 : x;                          // 当div1到窗口最左边时

								x = (x > window_width) ? window_width : x;    // 当div1到窗口最右边时

								y = (y < 0) ? 0 : y;                          // 当div1到窗口最上边时

								y = (y > window_height) ? window_height : y;  // 当div1到窗口最下边时



								el.style.left = x + "px";

								el.style.top = y + "px";

							}



						}, false)



					}, false);
				} else {
					//桌面端
					var offsetX = 0
					var offsetY = 0
					function down(e) {
						offsetX = (e.pageX - el.offsetLeft)
						offsetY = (e.pageY - el.offsetTop)
						if (isChildDom) {
							var childdom = el.querySelector(binding.value)
							childdom.style.position = "relative"

							if (binding.modifiers.cursor) childdom.style.cursor = "move"
							var barStyle = childdom.currentStyle
								? childdom.currentStyle
								: window.getComputedStyle(childdom, null)
							var boxStyle = el.currentStyle
								? el.currentStyle
								: window.getComputedStyle(el, null)
							var left = Number(barStyle.getPropertyValue("left").replace("px", "")) + Number(boxStyle.getPropertyValue("left").replace("px", "")) + Number(boxStyle.getPropertyValue("border-left-width").replace("px", ""))
							var right = left + Number(barStyle.getPropertyValue("width").replace("px", ""))
							var top = Number(barStyle.getPropertyValue("top").replace("px", "")) + Number(boxStyle.getPropertyValue("top").replace("px", "")) + Number(boxStyle.getPropertyValue("border-top-width").replace("px", ""))
							var bottom = top + Number(barStyle.getPropertyValue("height").replace("px", ""))
							// console.log(`left:${left}`)
							// console.log(`right:${right}`)
							// console.log(`top:${top}`)
							// console.log(`bottom:${bottom}`)
							// console.log(`clientX: ${e.clientX}`)
							// console.log(`clientY: ${e.clientY}`)
							if (e.clientX <= right && e.clientX >= left && e.clientY >= top && e.clientY <= bottom) {
								addEventListener("mousemove", move)
								addEventListener("mouseup", up)
							}
						} else {
							if (binding.modifiers.cursor) el.style.cursor = "move"
							addEventListener("mousemove", move)
							addEventListener("mouseup", up)
						}
					}
					function move(e) {
						el.style.left = (e.pageX - offsetX) + "px"
						el.style.top = (e.pageY - offsetY) + "px"
					}
					function up() {
						removeEventListener("mousemove", move)
						removeEventListener("mouseup", up)
					}
					el.addEventListener("mousedown", down)
				}
			}
		})
	}
}