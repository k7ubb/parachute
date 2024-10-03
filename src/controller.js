class Controller {
	CENTER_BUTTON_RATIO = 2.8;
	
	constructor(center, radius, execShot, execRotate) {
		this.path = { center, radius },
		this.draw = function() {
			$.ctx.bbFill(this.path, "#fff");
			$.ctx.bbStroke(this.path, {color: "#999", width: 2});
			$.ctx.bbStroke({ center, radius: radius / this.CENTER_BUTTON_RATIO }, {color: "#999", width: 2});
		};
		this.onClick = () => {
			if ($.isPointInPath({ center, radius: radius / this.CENTER_BUTTON_RATIO }, $.mouseX, $.mouseY)) {
				execShot();
			}
		};
		this.onMousePress = () => {
			if (!$.isPointInPath(this.path, $.startX, $.startY) || $.isPointInPath({ center, radius: radius / this.CENTER_BUTTON_RATIO }, $.mouseX, $.mouseY)) {
				return;
			}
			if (this.lastX !== undefined && this.lastY !== undefined) {
				const mouseX = $.mouseX - center.x;
				const mouseY = $.mouseY - center.y;
				const atan = Math.atan((mouseX * this.lastY - mouseY * this.lastX) / (mouseX * this.lastX + mouseY * this.lastY));
				const deg = atan * 180 / Math.PI;
				execRotate(deg);
			}
			this.lastX = $.mouseX - center.x;
			this.lastY = $.mouseY - center.y;
		};
		this.onMouseUp = () => {
			this.lastX = this.lastY = undefined;
		};
	}
}