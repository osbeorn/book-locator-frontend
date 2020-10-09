import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '.scroll-to-top'
})
export class ScrollToTopDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @HostListener('window:scroll', ['$event'])
  scroll($event): void {
    if (window.pageYOffset > 100) {
      this.el.nativeElement.classList.add('visible');
    } else {
      this.el.nativeElement.classList.remove('visible');
    }
  }

  @HostListener('click', ['$event'])
  click($event): void {
    window.scrollTo({ behavior: 'smooth', left: 0, top: 0});
    $event.preventDefault();
  }
}
