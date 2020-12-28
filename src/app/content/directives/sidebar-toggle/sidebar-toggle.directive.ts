import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '#sidebarToggle, #sidebarToggleTop'
})
export class SidebarToggleDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.resizeCallback(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  resize(event: any): void {
    this.resizeCallback(event.target.innerWidth);
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

  private resizeCallback(width: number): void {
    const body = document.getElementsByTagName('body')[0];
    const sidebar = document.getElementsByClassName('sidebar')[0];

    if (width < 480 && !sidebar.classList.contains('toggled')) {
      body.classList.toggle('sidebar-toggled');
      sidebar.classList.toggle('toggled');
    }
  }
}
