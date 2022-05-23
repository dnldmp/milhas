import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Input from "./Components/Form/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

type milesFormData = {
  promotion: number;
  price: number;
  quantidade: number;
  limit: number;
};

const milesFormSchema = yup.object().shape({
  promotion: yup
    .number()
    .positive("Precisa ser um número positivo")
    .required("O percentual é obrigatório"),
  price: yup
    .number()
    .positive("Precisa ser um número positivo")
    .required("O custo por mil é obrigatório"),
});

export default function Home() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(milesFormSchema),
  });

  const { errors } = formState;

  const [fator, setFator] = useState(0);
  const [custo, setCusto] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [total, setTotal] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);

  const handleCalculation: SubmitHandler<milesFormData> = async (values) => {
    const { promotion, price, quantidade, limit } = values;
    const f = (100 + promotion) / 100;
    const c = price / f;
    const b = (promotion / 100) * Number(quantidade);
    const t = b + Number(quantidade);
    const mp = Number(limit) / (f - 1);

    setFator(f);
    setCusto(c);
    setBonus(b);
    setTotal(t);
    setMaxPoints(mp);
  };

  return (
    <Flex w="100%" justify="center" h="100vh" align="center" flexDir="column">
      <Flex
        bg="gray.800"
        w="100%"
        p="2rem"
        maxW={360}
        as="form"
        borderRadius="8"
        flexDir="column"
        onSubmit={handleSubmit(handleCalculation)}
      >
        <Stack spacing="4">
          <Input
            name="promotion"
            label="Percentual de Bonus"
            type="number"
            error={errors.promotion}
            {...register("promotion")}
          />
          <Input
            name="price"
            label="Preço da milha"
            type="number"
            error={errors.price}
            {...register("price")}
          />
          <Input
            name="quantidade"
            label="Quantidade de milhas"
            type="number"
            error={errors.quantidade}
            {...register("quantidade")}
          />
          <Input
            name="limit"
            label="Limite do bonus"
            type="number"
            {...register("limit")}
          />
        </Stack>
        <Button
          type="submit"
          mt="6"
          colorScheme="pink"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Calcular
        </Button>
      </Flex>

      {fator !== 0 && custo !== 0 && (
        <Flex flexDir="column" bg="pink.400" borderRadius="8" m="4" p="6">
          <Heading size="md">Fator: {fator}</Heading>
          <Heading size="md">Custo da milha: {custo.toFixed(2)}</Heading>
          <Heading size="md">Bonus: {bonus.toFixed(2)}</Heading>
          <Heading size="md">Total de milhas: {total}</Heading>
          <Heading size="md">
            Numero max. milhas que podem ser transferidas:
            {maxPoints.toFixed(2)}
          </Heading>
        </Flex>
      )}
    </Flex>
  );
}
