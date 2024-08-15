import { Grid, TextField, Box, Typography, Autocomplete, Paper } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { getSendCountries, getIncomingCountries } from "../services/currencyService";
import { useEffect, useState } from "react";
import { CountryAndCurrency } from "../types/countriesTypes";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import React from "react";
import { convertFromClp, convertToClp } from "../services/converterService";

const chile: CountryAndCurrency = {
	isoCode: "CL",
	currency: "CLP",
	id: "clp",
	name: "Chile"
};

const eeuu: CountryAndCurrency = {
	isoCode: "US",
	currency: "USD",
	id: "64234ef1944eddcdba639d82",
	name: "Estados Unidos"
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
	function NumericFormatCustom(props, ref) {
		const { onChange, ...other } = props;

		return (
			<NumericFormat
				{...other}
				getInputRef={ref}
				onValueChange={(values) => {
					onChange({
						target: {
							name: props.name,
							value: values.value,
						},
					});
				}}
				thousandSeparator="."
				decimalSeparator=","
				valueIsNumericString
				style={{ 
					color: "#296b88",
					fontSize: "1.5em",
					fontWeight: "bold",
				 }} 
			/>
		);
	},
);


export default function ConverterComponent() {
	const currentDate = new Date().toISOString().split('T')[0];
	const [sourceCountry, setSourceCountry] = useState<CountryAndCurrency | null>(chile);
	const [sourceAmount, setAmount] = useState<number | null>(500000);
	const [targetAmount, setTargetAmount] = useState<number | null>(null);
	const [targetCountry, setTargetCountry] = useState<CountryAndCurrency | null>(eeuu);
	const [sendCountries, setSendCountries] = useState<CountryAndCurrency[]>([]);
	const [incomingCountries, setIncomingCountries] = useState<CountryAndCurrency[]>([]);
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);
	
	const targetChange = async (amount: number) => {
		if (sourceCountry?.isoCode === "CL" && sourceAmount && targetCountry) {

			const response = await convertFromClp(currentDate, targetCountry.currency.toLowerCase(), amount);

			if (response) {
				setTargetAmount(response.amount);
				setExchangeRate(response.exchangeRate);
			}
		} 
		else if (sourceCountry && sourceAmount && targetCountry) {
			const response = await convertToClp(currentDate, sourceCountry.currency.toLowerCase(), amount);
			
			if (response) {
				setTargetAmount(response.amount);
				setExchangeRate(response.exchangeRate);
			}
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			const sendCountries = await getSendCountries();
			const incomingCountries = await getIncomingCountries();
			
			sendCountries.unshift(chile);
			incomingCountries.unshift(chile);
			
			setSendCountries(sendCountries);
			setIncomingCountries(incomingCountries);
		};
		fetchData();
	}, []);

	useEffect(() => {
	const updateTargetAmount = async () => {
		await targetChange(sourceAmount || 0);
	};

	updateTargetAmount();
  }, [sourceAmount, targetCountry, sourceCountry]);



	return (
		<Box
			sx={{
				minHeight:"100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>	
			
			<Grid container
				maxWidth="60%"
				>
				<Grid item xs={12}>
					<Typography variant="h4" align="center" mb={3}>
						Cotizador
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="caption" align="left" mb={1} sx={{"color": "#457c9c" }}>
						Tipo de cambio: <b>{exchangeRate}</b>
					</Typography>
				</Grid>
				<Grid item xs={12} md={4}
					sx = {{
						backgroundColor: "#e5edf1",
					}}
				>
					<TextField
						variant="filled"
						id="sourceAmount"
						label="Tú envías"
						type="text"
						value={sourceAmount}
						fullWidth
						onChange={
							(event) => {
								const newValue = Number((event.target as HTMLInputElement).value);
								if (newValue !== sourceAmount) {
									setAmount(newValue);
								}
						}}

						InputLabelProps={{
							shrink: true,
						}}
						InputProps={{
							inputComponent: NumericFormatCustom as any,
							color: "warning",
						}}
					/>
				</Grid>
				<Grid item xs={12} md={2}>
					<Grid container 
						alignItems="center" 
						justifyContent="center"
						sx={{
							backgroundColor: "#296b88",
							height: "100%"
						}}
						>
						<Grid item xs={4} 
							justifyContent="center"
							pl={1}
						>
							{ sourceCountry && (
								<ReactCountryFlag
									countryCode={sourceCountry.isoCode}
									svg
									style={{
										width: '2em',
										height: '2em',
									}}
									title={sourceCountry.isoCode}
								/>
							)}
						</Grid>
						<Grid item xs={8}>
							<Autocomplete
								id="source"
								disableClearable
								options={incomingCountries}
								defaultValue={sourceCountry || chile}
								getOptionLabel={(option) => option.currency}
								onChange = {(event, newValue) => {
										if (newValue.isoCode === "CL") {
											setTargetCountry(eeuu);
										}
										else if (newValue.isoCode !== "CL" && targetCountry?.isoCode !== "CL") {
											setTargetCountry(chile);
										}
										setSourceCountry(newValue);


								}}
								filterOptions={(options, params) => {
									const filtered = options.filter((option) => {
										return option.name.toLowerCase().includes(params.inputValue.toLowerCase()) || option.currency.toLowerCase().includes(params.inputValue.toLowerCase());
									});
									return filtered;
								}}
								PaperComponent={({ children }) => (
									<Paper style={{ 
										width: '300px',
										}}>
										{children}
									</Paper>
								)}
								renderOption={(props, option) => {
									const { key, ...optionProps } = props;
									return (
										<Box
											key={option.id}
											component="li"
											sx={{ 
												'& > img': { mr: 2, flexShrink: 0 },
												width: "100%"	
											}}
											{...optionProps}
										>
											<ReactCountryFlag
												countryCode={option.isoCode}
												svg
												style={{
													width: '2em',
													height: '2em',
												}}
												title={option.isoCode}
											/>
											<Typography ml={1}>
												{option.currency} - {option.name}
											</Typography>
										</Box>
									);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="filled"
										inputProps={{
											...params.inputProps,
										}}
										sx={{
											"& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
												color: "white",
												width: 20,
												height: 20,
											},
											"& .MuiAutocomplete-input": {
												color: "white",
												fontWeight: "bold",
												border: "none",
											},
											"& .MuiAutocomplete-inputRoot": {
												color: "white",
												justifyContent: "center",
												alignItems: "center",
												padding: "initial",
												backgroundColor: "#296b88",
											}
	
										}}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={4} 
					sx={{
						backgroundColor: "#e5edf1",
					}}
				>
					<TextField
						variant="filled" 
						id="targetAmount"
						label="El destinatario recibe"
						type="text"
						value={targetAmount}
						fullWidth
						InputLabelProps={{
							shrink: true,
						}}
						onChange={(event) => {
							const newValue = Number(event.target.value);
							if (newValue !== targetAmount) {
								setTargetAmount(newValue);
							}
						}}

						InputProps={{
							inputComponent: NumericFormatCustom as any,

						}}
						
					/>
				</Grid>
				<Grid item xs={12} md={2}>
					<Grid container
						alignItems="center" 
						justifyContent="center"
						sx={{
							backgroundColor: "#296b88",
							height: "100%"
						}}
					>
						<Grid item xs={4} pl={1}>
							{
								targetCountry && (
									<ReactCountryFlag
										countryCode={targetCountry.isoCode}
										svg
										style={{
											width: '2em',
											height: '2em'
										}}
										title={targetCountry.isoCode}
									/>
								)
							}
						</Grid>
						<Grid item xs={8}>
							<Autocomplete
								id="target"
								disableClearable
								options={sourceCountry?.isoCode === "CL" ? sendCountries.filter((country) => country.isoCode !== "CL") : [chile]}
								value={targetCountry || undefined}
								getOptionLabel={(option) => option.currency}
								onChange = {(event, newValue) => {
									setTargetCountry(newValue);
								}}
								filterOptions={(options, params) => {
									const filtered = options.filter((option) => {
										return option.name.toLowerCase().includes(params.inputValue.toLowerCase()) || option.currency.toLowerCase().includes(params.inputValue.toLowerCase());
									});
									return filtered;
								}}
								PaperComponent={({ children }) => (
									<Paper style={{ 
										width: '300px',
										}}>
										{children}
									</Paper>
								)}
								renderOption={(props, option) => {
									const { key, ...optionProps } = props;
									return (
										<Box
											key={option.id}
											component="li"
											sx={{ 
												'& > img': { mr: 2, flexShrink: 0 },
												width: "100%"
											}}
											{...optionProps}
										>
											<ReactCountryFlag
												countryCode={option.isoCode}
												svg
												style={{
													width: '2em',
													height: '2em',
												}}
												title={option.isoCode}
											/>
											<Typography ml={1}>
												{option.currency} - {option.name}
											</Typography>
										</Box>
									);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="filled"
										inputProps={{
											...params.inputProps,
										}}

										sx={{
											
											"& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
												color: "white",
												width: 20,
												height: 20,
											},
											"& .MuiAutocomplete-input": {
												color: "white",
												fontWeight: "bold",
												border: "none",
											},
											"& .MuiAutocomplete-inputRoot": {
												color: "white",
												justifyContent: "center",
												alignItems: "center",
												padding: "initial",
												backgroundColor: "#296b88",
											}
										}}
									
									/>
								)}
							/>
						</Grid>	
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
}