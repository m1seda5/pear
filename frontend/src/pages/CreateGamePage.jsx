import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateGamePage = () => {
  const [formData, setFormData] = useState({
    teamA: {
      name: "",
      logo: "",
      players: []
    },
    teamB: {
      name: "",
      logo: "",
      players: []
    },
    startTime: "",
    category: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast({
        title: t("Success"),
        description: t("Game created successfully"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/games");
    } catch (error) {
      toast({
        title: t("Error"),
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        {t("Create New Game")}
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>{t("Team A Name")}</FormLabel>
              <Input
                name="teamA.name"
                value={formData.teamA.name}
                onChange={handleChange}
                placeholder={t("Enter team A name")}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("Team B Name")}</FormLabel>
              <Input
                name="teamB.name"
                value={formData.teamB.name}
                onChange={handleChange}
                placeholder={t("Enter team B name")}
              />
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel>{t("Start Time")}</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{t("Category")}</FormLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder={t("Select category")}
            >
              <option value="basketball">{t("Basketball")}</option>
              <option value="football">{t("Football")}</option>
              <option value="volleyball">{t("Volleyball")}</option>
              <option value="rugby">{t("Rugby")}</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t("Description")}</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("Enter game description")}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText={t("Creating...")}
          >
            {t("Create Game")}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateGamePage; 