import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import BasicEdit from './component/basic-edit';

import './index.less';

export default function EditBasicInfo(props: any) {
  const customerId = props.match.params.id || '';
  const customerAccount = props.match.params.account || '';
  return (
    <div>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <Link to={`/petowner-details/${customerId}/${customerAccount}`}>
            <FormattedMessage id="PetOwner.petOwnerDetail" />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="PetOwner.BasicInformation" />
        </Breadcrumb.Item>
      </BreadCrumb>
      <div>
        <BasicEdit customerId={customerId} customerAccount={customerAccount} />
      </div>
    </div>
  );
}
