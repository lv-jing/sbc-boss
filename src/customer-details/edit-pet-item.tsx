import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PetItem from './component/pet-item';

import './index.less';

export default function EditPetItem(props: any) {
  const customerId = props.match.params.id || '';
  const customerAccount = props.match.params.account || '';
  const petId = props.match.params.petid || '';
  return (
    <div>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <Link to={`/petowner-details/${customerId}/${customerAccount}`}>
            <FormattedMessage id="PetOwner.petOwnerDetail" />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="PetOwner.PetInformation" />
        </Breadcrumb.Item>
      </BreadCrumb>
      <div>
        <PetItem petId={petId} />
      </div>
    </div>
  );
}
