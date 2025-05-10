import React, { useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Select, Flex, Image, useColorModeValue, Box, Text
} from '@chakra-ui/react';
import { FieldArray, Formik, Form, Field } from 'formik';

const initialGame = {
  home_team: '',
  home_logo: '',
  away_team: '',
  away_logo: '',
  sport: '',
  category: '',
  start_time: '',
  end_time: '',
  background_image: '',
  confetti_team: '',
};

const ImageUpload = ({ value, onChange, label = "Upload Image", error, shape = "circle" }) => {
  const inputRef = useRef();
  const MAX_SIZE_MB = 2;
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onChange(null, "File must be an image");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onChange(null, `Image must be less than ${MAX_SIZE_MB}MB`);
      return;
    }
    onChange(file, null);
  };
  const handleRemove = () => {
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <Box textAlign="center">
      <Box mb={2} position="relative" display="inline-block">
        {value ? (
          <>
            <Image
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              boxSize="64px"
              borderRadius={shape === "circle" ? "full" : "lg"}
              border="2px solid"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              objectFit="cover"
              alt="Logo"
              mx="auto"
            />
            <Button size="xs" colorScheme="red" position="absolute" top={-2} right={-2} onClick={handleRemove}>X</Button>
          </>
        ) : (
          <Button
            onClick={() => inputRef.current.click()}
            size="sm"
            colorScheme="blue"
            borderRadius="full"
            px={4}
          >
            {label}
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </Box>
      {error && <Text color="red.400" fontSize="xs">{error}</Text>}
    </Box>
  );
};

const AdminGameModal = ({ isOpen, onClose, onSave, initialGames = [initialGame] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg={useColorModeValue('white', 'gray.800')}>
        <ModalHeader>Schedule Games</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ games: initialGames }}
          onSubmit={(values, actions) => {
            onSave(values.games);
            actions.setSubmitting(false);
            onClose();
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <ModalBody>
                <FieldArray name="games">
                  {({ push, remove }) => (
                    <>
                      {values.games.map((game, idx) => (
                        <Box key={idx} mb={8} p={4} borderRadius="lg" bg={useColorModeValue('gray.50', 'gray.700')} boxShadow="sm">
                          <Flex gap={4} mb={2}>
                            <FormControl>
                              <FormLabel>Home Team</FormLabel>
                              <Field as={Input} name={`games[${idx}].home_team`} />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Logo</FormLabel>
                              <ImageUpload
                                value={game.home_logo}
                                onChange={(file, err) => {
                                  setFieldValue(`games[${idx}].home_logo`, file);
                                  setFieldValue(`games[${idx}].home_logo_error`, err);
                                }}
                                label="Upload Home Logo"
                                error={game.home_logo_error}
                              />
                            </FormControl>
                          </Flex>
                          <Flex gap={4} mb={2}>
                            <FormControl>
                              <FormLabel>Away Team</FormLabel>
                              <Field as={Input} name={`games[${idx}].away_team`} />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Logo</FormLabel>
                              <ImageUpload
                                value={game.away_logo}
                                onChange={(file, err) => {
                                  setFieldValue(`games[${idx}].away_logo`, file);
                                  setFieldValue(`games[${idx}].away_logo_error`, err);
                                }}
                                label="Upload Away Logo"
                                error={game.away_logo_error}
                              />
                            </FormControl>
                          </Flex>
                          <Flex gap={4} mb={2}>
                            <FormControl>
                              <FormLabel>Sport</FormLabel>
                              <Field as={Select} name={`games[${idx}].sport`}>
                                <option value="">Select</option>
                                <option value="Football">Football</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Hockey">Hockey</option>
                                <option value="Rugby">Rugby</option>
                              </Field>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Category</FormLabel>
                              <Field as={Select} name={`games[${idx}].category`}>
                                <option value="">Select</option>
                                <option value="Boys">Boys</option>
                                <option value="Girls">Girls</option>
                              </Field>
                            </FormControl>
                          </Flex>
                          <Flex gap={4} mb={2}>
                            <FormControl>
                              <FormLabel>Start Time</FormLabel>
                              <Field as={Input} name={`games[${idx}].start_time`} type="datetime-local" />
                            </FormControl>
                            <FormControl>
                              <FormLabel>End Time</FormLabel>
                              <Field as={Input} name={`games[${idx}].end_time`} type="datetime-local" />
                            </FormControl>
                          </Flex>
                          <FormControl mb={2}>
                            <FormLabel>Background Image</FormLabel>
                            <ImageUpload
                              value={game.background_image}
                              onChange={(file, err) => {
                                setFieldValue(`games[${idx}].background_image`, file);
                                setFieldValue(`games[${idx}].background_image_error`, err);
                              }}
                              label="Upload Background"
                              error={game.background_image_error}
                              shape="rounded"
                            />
                          </FormControl>
                          <FormControl mb={2}>
                            <FormLabel>Confetti Team (short name)</FormLabel>
                            <Field as={Input} name={`games[${idx}].confetti_team`} placeholder="e.g. GSW" />
                          </FormControl>
                          {values.games.length > 1 && (
                            <Button colorScheme="red" size="xs" onClick={() => remove(idx)} mt={2}>Remove</Button>
                          )}
                        </Box>
                      ))}
                      <Button colorScheme="blue" variant="outline" onClick={() => push(initialGame)} leftIcon={'+'.repeat(1)} mb={4}>
                        Add Another Game
                      </Button>
                    </>
                  )}
                </FieldArray>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" mr={3} type="submit" isLoading={isSubmitting}>
                  Upload
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AdminGameModal; 