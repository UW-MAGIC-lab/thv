import { Component } from '../../../lib/Component';

export default class AddPose extends Component {
  constructor() {
    super();
  }

  render() {
    return `
    <div style='
    min-width: 600px;
    border: 2px dashed #BDC1C6;
    border-radius: 18px;
    text-align: center;
    padding: 30px;
    font-color: #BDC1C6;
    cursor: pointer;' class='add-pose-capture'>
      Add another pose
    </div>
    `
  }

  didMount() {
    let event = new Event('add-pose');
    this.addEventListener('click', () => {
      this.dispatchEvent(event);
    })
    return Promise.resolve();
  }
}

AddPose.tag = 'add-pose';
