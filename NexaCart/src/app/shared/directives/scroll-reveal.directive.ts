import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  constructor(
    private readonly el: ElementRef, 
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // 1. Assign the hardware-accelerated hidden properties safely
    this.renderer.addClass(this.el.nativeElement, 'reveal-hidden');

    // 2. Defer observation slightly to ensure layout is complete before checking viewport bounds
    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.renderer.removeClass(this.el.nativeElement, 'reveal-hidden');
              this.renderer.addClass(this.el.nativeElement, 'reveal-visible');
              observer.unobserve(this.el.nativeElement); // Performance optimization
            }
          });
        },
        {
          threshold: 0.01,         // Trigger as soon as the top pixel touches the boundary line
          rootMargin: '0px 0px 150px 0px' // Predictively reveals elements 150px before they cross into view
        }
      );

      observer.observe(this.el.nativeElement);
    }, 0);
  }
}