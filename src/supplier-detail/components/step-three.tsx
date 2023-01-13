import React from 'react';
import styled from 'styled-components';


const Content = styled.div`
  padding-bottom: 20px;
`;
export default class StepThree extends React.Component<any, any> {

  render() {
    return (
      <div>
        <Content>
          <div>
            LEGAL CONTRACT <br />
            Mars is al meer dan 100 jaar een trots familiebedrijf. Het is deze onafhankelijkheid die het ons toestaat om
            in generaties te denken en niet in kwartalen, zodat we kunnen investeren in de langetermijntoekomst van ons
            bedrijf, onze mensen, onze klanten en de planeet — allemaal gedreven door onze vaste principes. Wij geloven
            dat de wereld die we morgen willen begint met de manier waarop we vandaag zaken doen.
            <br />
            Onze principes voor gegevensbescherming:
            <br />
            1. Wij hechten waarde aan en respecteren de persoonsgegevens die ons zijn toevertrouwd.
            <br />
            2. We streven ernaar transparant en verantwoordelijk te zijn in de manier waarop wij met de aan ons
            toevertrouwde persoonsgegevens omgaan , waarbij we ons laten leiden door onze vijf principes en de wet.
            <br />
            3. We houden ons aan de privacyrechten van onze consumenten, klanten en sollicitanten, en respecteren deze.
            <br />
            4. We streven naar een voortdurende verbetering van onze privacy- en veiligheidsprocedures.
            <br />
            5. Deze privacyverklaring geeft je informatie over de manier waarop wij persoonsgegevens verzamelen,
            gebruiken en delen bij Mars, Incorporated, dochterondernemingen en aangesloten bedrijven (tezamen, “Mars,”
            “wij,” “ons” of “onze”), via onze websites, mobiele applicaties of andere sites waarop deze
            privacyverklaring staat vermeld (tezamen de “Sites”). Deze privacyverklaring is ook van toepassing op
            informatie die wordt verzameld van jou persoonlijk en in een van onze winkels en/of dierenziekenhuizen (ook
            de “Sites“) en wanneer je solliciteert naar een baan bij Mars.
          </div>
        </Content>
      </div>
    );
  };
}
