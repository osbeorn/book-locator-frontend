import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '#sidebarToggle, #sidebarToggleTop'
})
export class SidebarToggleDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @HostListener('click')
  click(): void {
    this.el.nativeElement.closest('body').classList.toggle('sidebar-toggled');
    this.el.nativeElement.closest('.sidebar').classList.toggle('toggled');
  }
}
