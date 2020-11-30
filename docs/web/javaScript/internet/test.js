class BomEvent {
    constructor(element) {
        this.element = element
    }
     
    addEventListener(type, handler) {
      if (this.element.addEventListener) {
        this.element.addEventListener(type, handler)
      } else if(this.element.attachEvent){
        this.element.attachEvent(`on${type}`, function () {
            handler.call(element)
        })
      } else {
        this.element['on' + type] = handler
      }
    }

    removeEvent(type, handler) {
        if (this.element.removeEventListener) {
            this.element.removeEventListener(type, handler)
          } else if(this.element.detachEvent){
            this.element.detachEvent(`on${type}`, function () {
                handler.call(element)
            })
          } else {
            this.element['on' + type] = null
          }
    }
}

function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation()
    } else {
        e.cancelBUbble = true // IE
    }
}
