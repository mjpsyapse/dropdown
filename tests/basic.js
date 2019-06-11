/* eslint-disable func-names */
import expect from 'expect.js';
import Menu, { Item as MenuItem, Divider } from 'rc-menu';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-dom/test-utils';
import $ from 'jquery';
import Dropdown from '../src';
import '../assets/index.less';

describe('dropdown', () => {
  let div;
  beforeEach(() => {
    if (!div) {
      div = document.createElement('div');
      document.body.appendChild(div);
    }
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('default visible', () => {
    const dropdown = ReactDOM.render(
      <Dropdown overlay={<div className="check-for-visible">Test</div>} visible>
        <button className="my-button">open</button>
      </Dropdown>
      , div);
    expect(dropdown.getPopupDomNode()).to.be.ok();
  });

  it('simply works', () => {
    let clicked;
    let overlayClicked;

    function onClick({ key }) {
      clicked = key;
    }

    function onOverlayClick({ key }) {
      overlayClicked = key;
    }

    const menu = (
      <Menu style={{ width: 140 }} onClick={onClick}>
        <MenuItem key="1">
          <span className="my-menuitem">one</span>
        </MenuItem>
        <Divider />
        <MenuItem key="2">two</MenuItem>
      </Menu>
    );
    const dropdown = ReactDOM.render(
      <Dropdown trigger={['click']} overlay={menu} onOverlayClick={onOverlayClick}>
        <button className="my-button">open</button>
      </Dropdown>
      , div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(dropdown, 'my-button')[0]).to.be.ok();
    expect(ReactDOM.findDOMNode(TestUtils.scryRenderedDOMComponentsWithClass(dropdown,
      'rc-dropdown')[0])).not.to.be.ok();
    Simulate.click(TestUtils.scryRenderedDOMComponentsWithClass(dropdown, 'my-button')[0]);
    expect($(ReactDOM.findDOMNode(TestUtils.scryRenderedDOMComponentsWithClass(dropdown,
      'rc-dropdown')[0])).css('display')).not.to.be('none');
    expect(clicked).not.to.be.ok();
    Simulate.click($(dropdown.getPopupDomNode()).find('.my-menuitem')[0]);
    expect(clicked).to.be('1');
    expect(overlayClicked).to.be('1');
    expect($(dropdown.getPopupDomNode()).css('display')).to.be('none');
  });

  it('user pass minOverlayWidthMatchTrigger', () => {
    const overlay = <div style={{ width: 50 }}>Test</div>;
    const dropdown = ReactDOM.render(
      <Dropdown
        trigger={['click']}
        overlay={overlay}
        minOverlayWidthMatchTrigger={false}
      >
        <button style={{ width: 100 }} className="my-button">open</button>
      </Dropdown>
      , div);

    Simulate.click(
      TestUtils.findRenderedDOMComponentWithClass(dropdown, 'my-button'),
    );

    expect($(dropdown.getPopupDomNode()).width()).not.to.be(
      $(TestUtils.findRenderedDOMComponentWithClass(dropdown, 'my-button')).width()
    );
  });

  it('should support default openClassName', () => {
    const overlay = <div style={{ width: 50 }}>Test</div>;
    const dropdown = ReactDOM.render(
      <Dropdown
        trigger={['click']}
        overlay={overlay}
        minOverlayWidthMatchTrigger={false}
      >
        <button style={{ width: 100 }} className="my-button">open</button>
      </Dropdown>
      , div);
    const buttonNode = TestUtils.findRenderedDOMComponentWithClass(dropdown, 'my-button');
    Simulate.click(buttonNode);
    expect(buttonNode.className).to.be('my-button rc-dropdown-open');
    Simulate.click(buttonNode);
    expect(buttonNode.className).to.be('my-button');
  });

  it('should support custom openClassName', () => {
    const overlay = <div style={{ width: 50 }}>Test</div>;
    const dropdown = ReactDOM.render(
      <Dropdown
        trigger={['click']}
        overlay={overlay}
        minOverlayWidthMatchTrigger={false}
        openClassName="opened"
      >
        <button style={{ width: 100 }} className="my-button">open</button>
      </Dropdown>
      , div);
    const buttonNode = TestUtils.findRenderedDOMComponentWithClass(dropdown, 'my-button');
    Simulate.click(buttonNode);
    expect(buttonNode.className).to.be('my-button opened');
    Simulate.click(buttonNode);
    expect(buttonNode.className).to.be('my-button');
  });

  it('overlay callback', () => {
    const overlay = <div style={{ width: 50 }}>Test</div>;
    const dropdown = ReactDOM.render(
      <Dropdown trigger={['click']} overlay={() => overlay}>
        <button className="my-button">open</button>
      </Dropdown>
      , div);
    Simulate.click(TestUtils.scryRenderedDOMComponentsWithClass(dropdown, 'my-button')[0]);
    expect($(ReactDOM.findDOMNode(TestUtils.scryRenderedDOMComponentsWithClass(dropdown,
      'rc-dropdown')[0])).css('display')).not.to.be('none');
  });
});
