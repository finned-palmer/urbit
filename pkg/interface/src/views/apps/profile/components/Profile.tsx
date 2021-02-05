import React, {useEffect} from "react";
import { Sigil } from "~/logic/lib/sigil";
import { ViewProfile } from './ViewProfile';
import { EditProfile } from './EditProfile';
import { SetStatus } from './SetStatus';

import { uxToHex } from "~/logic/lib/util";
import {
  Center,
  Box,
  Row,
  BaseImage,
  StatelessTextInput as Input,
  Button
} from "@tlon/indigo-react";
import useLocalState from "~/logic/state/local";
import { useHistory } from "react-router-dom";


export function Profile(props: any) {
  const { hideAvatars } = useLocalState(({ hideAvatars }) => ({
    hideAvatars
  }));
  if (!props.ship) {
    return null;
  }
  const { contact, nackedContacts, hasLoaded, isPublic, isEdit, ship } = props;
  const nacked = nackedContacts.has(ship);

  useEffect(() => {
    if(hasLoaded && !contact && !nacked) {
      props.api.contacts.retrieve(ship);
    }
  }, [hasLoaded, contact])

  
  const hexColor = contact?.color ? `#${uxToHex(contact.color)}` : "#000000";
  const cover = (contact?.cover)
    ? <BaseImage src={contact.cover} width='100%' height='100%' style={{ objectFit: 'cover' }} />
    : <Box display="block" width='100%' height='100%' backgroundColor='washedGray' />;

  const image = (!hideAvatars && contact?.avatar)
    ? <BaseImage src={contact.avatar} width='100%' height='100%' style={{ objectFit: 'cover' }} />
    : <Sigil ship={ship} size={96} color={hexColor} />;

  return (
    <Center
      p={4}
      height="100%"
      width="100%">
      <Box
        maxWidth="600px"
        width="100%">
        { ship === `~${window.ship}` ? (
            <SetStatus ship={ship} contact={contact} api={props.api} />
          ) : null
        }
        <Row width="100%" height="300px">
          {cover}
        </Row>
        <Row
          pb={2}
          alignItems="center"
          width="100%"
        >
          <Center width="100%" marginTop="-48px">
            <Box height='96px' width='96px' borderRadius="2" overflow="hidden">
              {image}
            </Box>
          </Center>
        </Row>
        { isEdit ? (
          <EditProfile
            ship={ship}
            contact={contact}
            s3={props.s3}
            api={props.api}
            groups={props.groups}
            associations={props.associations}
            isPublic={isPublic}/>
        ) : (
          <ViewProfile 
            api={props.api}
            nacked={nacked}
            ship={ship}
            contact={contact}
            isPublic={isPublic} 
          />
        ) }
      </Box>
    </Center>
  );
}