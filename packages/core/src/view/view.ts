import { Writable } from "../schema/index";
import { IActionHandler } from "../dispatcher/action";
import { createElement } from "./helpers";

export interface View<TParentView extends View<any> = any> {
  /**
   * Renders the view.
   */
  //render?(): HTMLElement;

  /**
   * Update view on 'model' change
   */
  updateView?(): boolean;

  /**
   * Handle viewport updates
   */
  layoutView(): this;

  /**
   * Triggered when view receives focus.
   */
  viewFocused?(): void;

  /**
   * Triggered when view loses focus.
   */
  viewBlurred?(): void;
}

export interface ViewParams {
  handler?: IActionHandler;
}

/**
 * Represents a rectangular area on the screen
 * and manages the content in that area.
 */
export abstract class View {
  static createElement = createElement;

  readonly handler: IActionHandler = null;

  $element: HTMLElement = null;
  parentView: View = null;
  readonly childViews: View<any>[] = [];
  hasFocus = false;
  needsUpdate = false;

  constructor({ handler }: ViewParams = {}) {
    this.handler = handler;
  }

  destroy() {
    Writable(this).handler = null;

    this.childViews.forEach(this.removeChildView);
  }

  get element() {
    return this.$element ? this.$element : (this.$element = this.render());
  }

  /**
   * Updates this view at next frame.
   * @fluent
   */
  triggerUpdate() {
    let refresh = true;

    if (!this.needsUpdate) {
      this.needsUpdate = true;
      window.requestAnimationFrame(() => {
        this.needsUpdate = false;

        if (this.updateView) {
          refresh = this.updateView();
        }
        if (refresh) this.refresh();
      });
    }

    return this;
  }

  /**
   * Rerenders the view.
   * @fluent
   */
  refresh() {
    const $oldElement = this.$element;

    // Only rerender if already bound
    if ($oldElement) {
      // force re-render
      this.$element = null;

      const $el = this.element;

      // replace root node in dom
      if ($oldElement && $oldElement.parentNode) {
        if ($el) $oldElement.parentNode.replaceChild($el, $oldElement);
        else $oldElement.parentNode.removeChild($oldElement);
      }
    }

    return this;
  }

  /**
   * Add child View.
   * Fluent interface
   */
  addChildView(view: View, nextView?: View) {
    if (!view) return this;

    // make sure view is detached
    if (this.parentView !== null) {
      this.parentView.removeChildView(this);
    }

    // Render and insert into DOM
    if (this.$element) {
      let $newChild = view.render();

      if ($newChild) {
        if (nextView) {
          this.element.insertBefore($newChild, nextView.element);
        } else this.$element.appendChild($newChild);
      }
    }

    view.parentView = this;

    this.childViews.push(view);

    return this;
  }

  /**
   * Returns child views.
   */
  get children(): View[] {
    return this.childViews;
  }

  /**
   * Render all child Views
   *
   * Helper for use within render functions, passed as 3rd param to createElement
   */
  protected renderChildViews(): HTMLElement[] {
    return View.renderViews(this.children);
  }

  /**
   * Remove child View.
   * Fluent interface
   */
  removeChildView(view: View) {
    const index = this.childViews.indexOf(view);

    if (index !== -1) {
      const $element = this.$element;

      this.childViews.splice(index, 1);
      view.parentView = null;

      if ($element.parentNode) {
        // Remove from DOM!
        $element.parentNode.removeChild($element);
      }

      view.destroy();
    }

    return this;
  }

  /*****************************************************************************
   *
   * Focus/Blur handling
   *
   ****************************************************************************/

  /**
   * Focus this view.
   * @fluent
   */
  focus() {
    return this.setFocus(true);
  }

  /**
   * Release this view's focus.
   * @fluent
   */
  blur() {
    return this.setFocus(false);
  }

  /**
   * Sets focus.
   * @fluent
   */
  private setFocus(focus: boolean) {
    if (focus !== this.hasFocus) {
      this.hasFocus = focus;
      if (focus) {
        // inform superview
        if (this.parentView) {
          //this.parentView.subviewDidFocus(this);
        }
        this.viewFocused && this.viewFocused();
      } else {
        // blur subviews
        this.childViews.forEach(subview => subview.blur());
        this.viewBlurred && this.viewBlurred();
      }
    }

    return this;
  }

  /*****************************************************************************
   *
   * Methods to be overridden by subclasses
   *
   ****************************************************************************/

  /**
   * Renders the view.
   */
  public abstract render(): HTMLElement;

  /**
   * Handle viewport updates
   * @fluent
   */
  public layoutView(): this {
    this.children.forEach(child => child.layoutView());

    return this;
  }
}

export namespace View {
  /**
   * Render multiple views
   */
  export function renderViews(views: Iterable<View>): HTMLElement[] {
    let result = [];

    for (let view of views) {
      result.push(view.element);
    }

    return result;
  }

  /**
   * Mount a View onto a DOM node
   */
  export function mount($rootElement: HTMLElement, rootView: View) {
    let $root = rootView.element;

    if ($root.tagName.toUpperCase() != "FRAGMENT")
      $rootElement.appendChild($root);
    else {
      let children = Array.from($root.children);
      children.forEach($item => {
        $rootElement.appendChild($item);
      });
    }
  }
}
