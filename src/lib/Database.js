import { Dexie } from 'dexie';
import { exportDB } from 'dexie-export-import';

// 'nose_x': results,'nose_y': results,'nose_z': results,'l_eye_in_x': results,'l_eye_in_y': results,'l_eye_in_z': results,'l_eye_x': results,'l_eye_y': results,'l_eye_z': results,'l_eye_out_x': results,'l_eye_out_y': results,'l_eye_out_z': results,'r_eye_in_x': results,'r_eye_in_y': results,'r_eye_in_z': results,'r_eye_x': results,'r_eye_y': results,'r_eye_z': results,'r_eye_out_x': results,'r_eye_out_y': results,'r_eye_out_z': results,'l_ear_x': results,'l_ear_y': results,'l_ear_z': results,'r_ear_x': results,'r_ear_y': results,'r_ear_z': results,'mouth_l_x': results,'mouth_l_y': results,'mouth_l_z': results,'mouth_r_x': results,'mouth_r_y': results,'mouth_r_z': results,'l_shoulder_x': results,'l_shoulder_y': results,'l_shoulder_z': results,'r_shoulder_x': results,'r_shoulder_y': results,'r_shoulder_z': results,'l_elbow_x': results,'l_elbow_y': results,'l_elbow_z': results,'r_elbow_x': results,'r_elbow_y': results,'r_elbow_z': results,'l_wrist_x': results,'l_wrist_y': results,'l_wrist_z': results,'r_wrist_x': results,'r_wrist_y': results,'r_wrist_z': results,'l_pinky_x': results,'l_pinky_y': results,'l_pinky_z': results,'r_pinky_x': results,'r_pinky_y': results,'r_pinky_z': results,'l_idx_x': results,'l_idx_y': results,'l_idx_z': results,'r_idx_x': results,'r_idx_y': results,'r_idx_z': results,'l_thumb_x': results,'l_thumb_y': results,'l_thumb_z': results,'r_thumb_x': results,'r_thumb_y': results,'r_thumb_z': results,'l_hip_x': results,'l_hip_y': results,'l_hip_z': results,'r_hip_x': results,'r_hip_y': results,'r_hip_z': results,'l_knee_x': results,'l_knee_y': results,'l_knee_z': results,'r_knee_x': results,'r_knee_y': results,'r_knee_z': results,'l_ankle_x': results,'l_ankle_y': results,'l_ankle_z': results,'r_ankle_x': results,'r_ankle_y': results,'r_ankle_z': results,'l_heel_x': results,'l_heel_y': results,'l_heel_z': results,'r_heel_x': results,'r_heel_y': results,'r_heel_z': results,'l_ft_idx_x': results,'l_ft_idx_y': results,'l_ft_idx_z': results,'r_ft_idx_x': results,' r_ft_idx_y': results, 'r_ft_idx_z': results,'rh_wrist_x': results,'rh_wrist_y': results,'rh_wrist_z': results,'rh_thumb_cmc_x': results,'rh_thumb_cmc_y': results,'rh_thumb_cmc_z': results,'rh_thumb_mcp_x': results,'rh_thumb_mcp_y': results,'rh_thumb_mcp_z': results,'rh_thumb_ip_x': results,'rh_thumb_ip_y': results,'rh_thumb_ip_z': results,'rh_thumb_tip_x': results,'rh_thumb_tip_y': results,'rh_thumb_tip_z': results,'rh_idx_mcp_x': results,'rh_idx_mcp_y': results,'rh_idx_mcp_z': results,'rh_idx_pip_x': results,'rh_idx_pip_y': results,'rh_idx_pip_z': results,'rh_idx_dip_x': results,'rh_idx_dip_y': results,'rh_idx_dip_z': results,'rh_idx_tip_x': results,'rh_idx_tip_y': results,'rh_idx_tip_z': results,'rh_mddl_mcp_x': results,'rh_mddl_mcp_y': results,'rh_mddl_mcp_z': results,'rh_mddl_pip_x': results,'rh_mddl_pip_y': results,'rh_mddl_pip_z': results,'rh_mddl_dip_x': results,'rh_mddl_dip_y': results,'rh_mddl_dip_z': results,'rh_mddl_tip_x': results,'rh_mddl_tip_y': results,'rh_mddl_tip_z': results,'rh_ring_mcp_x': results,'rh_ring_mcp_y': results,'rh_ring_mcp_z': results,'rh_ring_pip_x': results,'rh_ring_pip_y': results,'rh_ring_pip_z': results,'rh_ring_dip_x': results,'rh_ring_dip_y': results,'rh_ring_dip_z': results,'rh_ring_tip_x': results,'rh_ring_tip_y': results,'rh_ring_tip_z': results,'rh_pink_mcp_x': results,'rh_pink_mcp_y': results,'rh_pink_mcp_z': results,'rh_pink_pip_x': results,'rh_pink_pip_y': results,'rh_pink_pip_z': results,'rh_pink_dip_x': results,'rh_pink_dip_y': results,'rh_pink_dip_z': results,'rh_pink_tip_x': results,'rh_pink_tip_y': results,'rh_pink_tip_z': results,
// 'lh_wrist_x','lh_wrist_y','lh_wrist_z','lh_thumb_cmc_x','lh_thumb_cmc_y','lh_thumb_cmc_z','lh_thumb_mcp_x','lh_thumb_mcp_y','lh_thumb_mcp_z','lh_thumb_ip_x','lh_thumb_ip_y','lh_thumb_ip_z','lh_thumb_tip_x','lh_thumb_tip_y','lh_thumb_tip_z','lh_idx_mcp_x','lh_idx_mcp_y','lh_idx_mcp_z','lh_idx_pip_x','lh_idx_pip_y','lh_idx_pip_z','lh_idx_dip_x','lh_idx_dip_y','lh_idx_dip_z','lh_idx_tip_x','lh_idx_tip_y','lh_idx_tip_z','lh_mddl_mcp_x','lh_mddl_mcp_y','lh_mddl_mcp_z','lh_mddl_pip_x','lh_mddl_pip_y','lh_mddl_pip_z','lh_mddl_dip_x','lh_mddl_dip_y','lh_mddl_dip_z','lh_mddl_tip_x','lh_mddl_tip_y','lh_mddl_tip_z','lh_ring_mcp_x','lh_ring_mcp_y','lh_ring_mcp_z','lh_ring_pip_x','lh_ring_pip_y','lh_ring_pip_z','lh_ring_dip_x','lh_ring_dip_y','lh_ring_dip_z','lh_ring_tip_x','lh_ring_tip_y','lh_ring_tip_z','lh_pink_mcp_x','lh_pink_mcp_y','lh_pink_mcp_z','lh_pink_pip_x','lh_pink_pip_y','lh_pink_pip_z','lh_pink_dip_x','lh_pink_dip_y','lh_pink_dip_z','lh_pink_tip_x','lh_pink_tip_y','lh_pink_tip_z',

export class Database extends Dexie {
  constructor() {
    super('thv_online');

    this.version(1).stores({
      clickstream: '++id,scene,timestamp'
    });

    this.clickstream = this.table('clickstream');
  }

  addClickstreamData(scene, results) {
    return this.clickstream.add({
      scene: scene,
      timestamp: new Date().toISOString()
    });
  }

  async exportAndDownload() {
    const blobUrl = URL.createObjectURL(await exportDB(this));
    debugger;
    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = 'data-download.json';

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    // Remove link from body
    document.body.removeChild(link);
  }
}
