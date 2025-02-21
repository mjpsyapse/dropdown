import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Trigger from '@mjpsyapse/rc-trigger';
import classNames from 'classnames';
import placements from './placements';
import { polyfill } from 'react-lifecycles-compat';

class Dropdown extends Component {
  static propTypes = {
    minOverlayWidthMatchTrigger: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    onOverlayClick: PropTypes.func,
    prefixCls: PropTypes.string,
    children: PropTypes.any,
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string,
    openClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object,
    placement: PropTypes.string,
    overlay: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),
    trigger: PropTypes.array,
    alignPoint: PropTypes.bool,
    showAction: PropTypes.array,
    hideAction: PropTypes.array,
    getPopupContainer: PropTypes.func,
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool,
  };

  static defaultProps = {
    prefixCls: 'rc-dropdown',
    trigger: ['hover'],
    showAction: [],
    overlayClassName: '',
    overlayStyle: {},
    defaultVisible: false,
    onVisibleChange() {
    },
    placement: 'bottomLeft',
  }

  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
    this.ref = React.createRef();
    if ('visible' in props) {
      this.state = {
        visible: props.visible,
      };
    } else {
      this.state = {
        visible: props.defaultVisible,
      };
    }
  }

  onClick = (e) => {
    const props = this.props;
    const overlayProps = this.getOverlayElement().props;
    // do no call onVisibleChange, if you need click to hide, use onClick and control visible
    if (!('visible' in props)) {
      this.setState({
        visible: false,
      });
    }
    if (props.onOverlayClick) {
      props.onOverlayClick(e);
    }
    if (overlayProps.onClick) {
      overlayProps.onClick(e);
    }
  }

  onVisibleChange = (visible) => {
    const props = this.props;
    if (!('visible' in props)) {
      this.setState({
        visible,
      });
    }
    props.onVisibleChange(visible);
  }

  static getDerivedStateFromProps(nextProps) {
    if ('visible' in nextProps) {
      return {
        visible: nextProps.visible,
      };
    }
    return null;
  }

  getMinOverlayWidthMatchTrigger = () => {
    const { minOverlayWidthMatchTrigger, alignPoint } = this.props;
    if ('minOverlayWidthMatchTrigger' in this.props) {
      return minOverlayWidthMatchTrigger;
    }

    return !alignPoint;
  };

  getOverlayElement() {
    const { overlay } = this.props;
    let overlayElement;
    if (typeof overlay === 'function') {
      overlayElement = overlay();
    } else {
      overlayElement = overlay;
    }
    return overlayElement;
  }

  getMenuElement = () => {
    const { prefixCls } = this.props;
    const overlayElement = this.getOverlayElement();
    const extraOverlayProps = {
      prefixCls: `${prefixCls}-menu`,
      onClick: this.onClick,
    };
    if (typeof overlayElement.type === 'string') {
      delete extraOverlayProps.prefixCls;
    }
    return React.cloneElement(overlayElement, extraOverlayProps);
  }

  getMenuElementOrLambda() {
    const { overlay } = this.props;
    if (typeof overlay === 'function') {
      return this.getMenuElement;
    }
    return this.getMenuElement();
  }

  getPopupDomNode() {
    return this.triggerRef.current.getPopupDomNode();
  }

  getOpenClassName() {
    const { openClassName, prefixCls } = this.props;
    if (openClassName !== undefined) {
      return openClassName;
    }
    return `${prefixCls}-open`;
  }

  afterVisibleChange = (visible) => {
    if (visible && this.getMinOverlayWidthMatchTrigger()) {
      const overlayNode = this.getPopupDomNode();
      const rootNode = this.ref.current; // internals of trigger
      if (rootNode && overlayNode && rootNode.offsetWidth > overlayNode.offsetWidth) {
        overlayNode.style.minWidth = `${rootNode.offsetWidth}px`;
        if (this.triggerRef.current &&
            this.triggerRef.current._component &&
            this.triggerRef.current._component.alignInstance) {
          this.triggerRef.current._component.alignInstance.forceAlign();
        }
      }
    }
  }

  renderChildren() {
    const { children } = this.props;
    const { visible } = this.state;
    const childrenProps = children.props ? children.props : {};
    const childClassName = classNames(childrenProps.className, this.getOpenClassName());
    return (visible && children) ? cloneElement(children, { className: childClassName }) : children;
  }

  render() {
    const {
      prefixCls,
      transitionName, animation,
      align, placement, getPopupContainer,
      showAction, hideAction,
      overlayClassName, overlayStyle,
      trigger, ...otherProps,
    } = this.props;

    let triggerHideAction = hideAction;
    if (!triggerHideAction && trigger.indexOf('contextMenu') !== -1) {
      triggerHideAction = ['click'];
    }

    return (
      <Trigger
        {...otherProps}
        prefixCls={prefixCls}
        ref={this.triggerRef}
        forwardedRef={this.ref}
        popupClassName={overlayClassName}
        popupStyle={overlayStyle}
        builtinPlacements={placements}
        action={trigger}
        showAction={showAction}
        hideAction={triggerHideAction || []}
        popupPlacement={placement}
        popupAlign={align}
        popupTransitionName={transitionName}
        popupAnimation={animation}
        popupVisible={this.state.visible}
        afterPopupVisibleChange={this.afterVisibleChange}
        popup={this.getMenuElementOrLambda()}
        onPopupVisibleChange={this.onVisibleChange}
        getPopupContainer={getPopupContainer}
      >
        {this.renderChildren()}
      </Trigger>
    );
  }
}

polyfill(Dropdown);

export default Dropdown;
