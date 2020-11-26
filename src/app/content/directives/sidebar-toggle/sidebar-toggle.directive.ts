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
    const body = document.getElementsByTagName('body')[0];
    const sidebar = document.getElementsByClassName('sidebar')[0];

    body.classList.toggle('sidebar-toggled');
    sidebar.classList.toggle('toggled');

    // if (sidebar.classList.contains('toggled')) {
    //
    // }
  }
}
