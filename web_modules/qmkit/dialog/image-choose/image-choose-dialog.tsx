/**
 * 等待分离图片弹窗
 */

import React, { Component } from "react";
import { log, msg } from "@qianmi/x-site-kit";
// import QMDialog from "qm-ux/lib/QMDialog";
// import QMImg from "qm-ui/lib/QMImg";
// import GalleryBox from "@wanmi/wm-bus/lib/GalleryBox";

/**
 * 选择图片参数:
 */
export interface IChooseImageParams {
  changeVal: any; //选择图片后回调方法
  limit?: number; //图片选择数量
  fileType?: string; //pic all video,
  onChooseImage?({ limit, fileType }): Promise<any>;
}

/**
 * 调用业务线图片参数:
 */
export interface IChooseThirdImageParams {
  currentVal?: string;
  limit?: number;
  __data_info?: Object;
  fileType?: string; //pic all video
}
//
// /**
//  * 弹出图片选择框, 供用户选择图片
//  * @deprecated initiator 暂不确定
//  * 弹出框使用者 当事件发起人是 富文本编辑器的时候 关闭弹出框 取消重置微信编辑框的位置
//  */
// export default async (params: IChooseImageParams) => {
//   let { limit = 1, fileType = "pic", changeVal, onChooseImage } = params;
//
//   // 弹窗默认使用 QMDailog-GalleryBox
//   if (typeof onChooseImage !== "function") {
//     onChooseImage = async () => {
//       const top = ((window.innerHeight || 900) - 540) / 2;
//       const list = await QMDialog.load(
//         <GalleryBox hash="_gallery" limit={limit} fileType={fileType} />,
//         {
//           title: "选择文件",
//           width: 800,
//           style: { top },
//           className: "modal-custom select-picture-library",
//         },
//       );
//       if (list.length < 1) throw "图片为空";
//
//       return list.map(item => ({
//         ...item,
//         src: QMImg.src({ src: item.path }),
//       }));
//     };
//   }
//
//   try {
//     let images = await onChooseImage({ limit, fileType });
//     images = images.map(item => ({ type: "image-custom", info: item }));
//     log("图片选择值为::", images);
//     changeVal(limit === 1 ? images[0] : images);
//   } catch (error) {
//     log("选择图片错误::", error);
//   }
// };
