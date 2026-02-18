import { FuncionarioResponseBody } from '@/types/funcionario.type';
import { PagamentoResponseBody } from '@/types/pagamento.type';
import { Vale } from '@/types/vale.type';
import { calcularBaseSalary, calculateTotalIncentive, calculateTotalVauchers } from '@/utils/calculate';
import { formatDate, formatMoney } from '@/utils/format';
import { PDFDocument, rgb, StandardFonts, RotationTypes } from 'pdf-lib';

export const PdfService = {

  async generatePaymentRelatory(
    employee: FuncionarioResponseBody,
    payment: PagamentoResponseBody,
    data_pag: Date,
    digitalSignature: boolean = false,
  ) {
    const vouchers = payment.vales || [];
    const incentives = payment.incentivo || [];
    const dataInicio = vouchers.length ? formatDate(new Date(vouchers[0].data_adicao)) : data_pag;
    const totalVouchers = calculateTotalVauchers(vouchers);
    const totalIncentives = calculateTotalIncentive(incentives);

    const baseSalary = calcularBaseSalary(employee)

    const finalSalary = baseSalary - totalVouchers + totalIncentives;

    // create the pdf doc
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // 1° page - declaration
    let page = pdfDoc.addPage([595.28, 841.89]); // Tamanho A4
    const { width, height } = page.getSize();
    let yCursor = height - 50;

    // styles
    const stylesText = {
      x: 50,
      size: 12,
      font: timesRomanFont,
      maxWidth: width - 100,
      lineHeight: 15,
    }

    // title
    page.drawText('Declaração de Recebimento de Remuneração Quinzenal', {
      x: 50,
      y: yCursor,
      size: 16,
      font: timesBoldFont,
    });

    yCursor -= 40;

    page.drawText(`Declaro, para os devidos fins, que eu, ${employee.nome} , recebi da empresa o valor ${formatMoney(finalSalary)} referente à minha remuneração quinzenal, correspondente ao período de apuração informado em meu contracheque.`, { ...stylesText, y: yCursor });
    page.drawText(`Declaro ainda que o payment foi realizado de forma correta, estando de acordo com os valores discriminados no respectivo contracheque, incluindo a remuneração pactuada e eventuais adicionais ou benefícios concedidos.`, { ...stylesText, y: yCursor -= 50 });
    page.drawText(`Afirmo que o valor recebido corresponde integralmente ao que me era devido no período mencionado, não havendo, até a presente data, qualquer reclamação, divergência ou pendência financeira relacionada ao payment efetuado, dando plena, geral e irrevogável quitação quanto aos valores recebidos.`, { ...stylesText, y: yCursor -= 50 });

    // signature area
    if (payment.assinatura && digitalSignature) {
      try {
        const signatureImageBytes = await fetch(payment.assinatura).then(res => res.arrayBuffer());
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

        page.drawText(`Assinatura digital:`, {
          ...stylesText, y: yCursor -= 80, font: timesBoldFont
        });

        page.drawImage(signatureImage, {
          x: 50,
          y: yCursor -= 10,
          width: 100,
          height: 150,
          rotate: { angle: -1.5708, type: RotationTypes.Radians }
        });
      } catch (e) {
        console.error("Erro ao carregar assinatura", e);
      }
    } else {
      // manual signature
      yCursor -= 100
      page.drawLine({ start: { x: 50, y: yCursor }, end: { x: 250, y: yCursor } });
      page.drawText('Funcionário', { x: 110, y: yCursor - 15, size: 10 });

      page.drawLine({ start: { x: 340, y: yCursor }, end: { x: 540, y: yCursor } });
      page.drawText('Responsável', { x: 400, y: yCursor - 15, size: 10 });
    }

    // 2° page - relatory
    page = pdfDoc.addPage([595.28, 841.89]);
    yCursor = height - 50;

    page.drawText('Relatório de Pagamento', { x: 50, y: yCursor, size: 16, font: timesBoldFont });
    yCursor -= 20;
    page.drawText(`Período: ${dataInicio.toLocaleString()} até ${data_pag.toLocaleDateString()}`, { x: 50, y: yCursor, size: 10 });

    // employee area
    yCursor -= 40;
    page.drawText('FUNCIONÁRIO', { x: 50, y: yCursor, size: 12, font: timesBoldFont });
    page.drawLine({ start: { x: 50, y: yCursor - 5 }, end: { x: 540, y: yCursor - 5 } });

    yCursor -= 25;
    const gridEmployeeInfo = [
      `Nome: ${employee.nome}`,
      `CPF: ${employee.cpf || 'Não informado'}`,
      `Cargo: ${employee.cargo}`,
      `Salário Bruto: ${formatMoney(payment.salario_atual)}`,
      `Tipo: ${employee.tipo}`,
      `Data de admissão: ${formatDate(new Date(employee.data_admissao))}`
    ];

    gridEmployeeInfo.forEach((text, index) => {
      const isEven = (index % 2 === 0);

      page.drawText(text, { x: isEven ? 50 : 350, y: yCursor, size: 11 });
      if (!isEven) yCursor -= 15;
    });

    yCursor -= 25;
    page.drawText('RESUMO DO PAGAMENTO', { x: 50, y: yCursor, size: 12, font: timesBoldFont });
    page.drawLine({ start: { x: 50, y: yCursor - 5 }, end: { x: 540, y: yCursor - 5 } });

    yCursor -= 25;
    const gridPaymentResume = [
      `Data do payment: ${formatDate(new Date(payment.data_pagamento))}`,
      `Salário Pago: ${formatMoney(payment.valor_pago)}`,
      `Salário Base: ${formatMoney(calcularBaseSalary(employee))}`,
      `Total em vouchers: ${formatMoney(calculateTotalVauchers(payment.vales))}`,
      `Total em incentives: ${formatMoney(totalIncentives)}`,
    ];

    gridPaymentResume.forEach((text, index) => {
      const isEven = (index % 2 === 0);

      page.drawText(text, { x: isEven ? 50 : 350, y: yCursor, size: 11 });
      if (!isEven) yCursor -= 15;
    });


    // voucher table
    yCursor -= 30;
    page.drawText('VALES', { x: 50, y: yCursor, size: 12, font: timesBoldFont });
    yCursor -= 20;

    // table header
    page.drawRectangle({ x: 50, y: yCursor - 5, width: 490, height: 20, color: rgb(0.9, 0.9, 0.9) });
    page.drawText('Data', { x: 55, y: yCursor, size: 10, font: timesBoldFont });
    page.drawText('Descrição', { x: 150, y: yCursor, size: 10, font: timesBoldFont });
    page.drawText('Qtd.', { x: 300, y: yCursor, size: 10, font: timesBoldFont });
    page.drawText('Valor Unit.', { x: 380, y: yCursor, size: 10, font: timesBoldFont });
    page.drawText('Total', { x: 480, y: yCursor, size: 10, font: timesBoldFont });

    yCursor -= 20;
    vouchers.forEach((v: Vale) => {
      page.drawText((formatDate(new Date(v.data_adicao))), { x: 55, y: yCursor, size: 10 });
      page.drawText(v.descricao.substring(0, 30), { x: 150, y: yCursor, size: 10 });
      page.drawText(v.quantidade.toString(), { x: 300, y: yCursor, size: 10 });
      page.drawText(formatMoney(v.preco_unit), { x: 380, y: yCursor, size: 10 });
      page.drawText(formatMoney(v.preco_unit * v.quantidade), { x: 480, y: yCursor, size: 10 });
      yCursor -= 15;

      if (yCursor < 50) {
        page = pdfDoc.addPage([595.28, 841.89]);
        yCursor = height - 50;
      }
    });

    // total vouchers line
    yCursor -= 10;
    page.drawRectangle({ x: 50, y: yCursor - 5, width: 490, height: 20, color: rgb(0.9, 0.9, 0.9) });
    page.drawText('TOTAL EM VALES', { x: 55, y: yCursor, size: 10, font: timesBoldFont });
    page.drawText(formatMoney(totalVouchers), { x: 480, y: yCursor, size: 10, font: timesBoldFont });

    if (payment.incentivo.length > 0) {
      // incentive table
      yCursor -= 30;
      page.drawText('INCENTIVOS', { x: 50, y: yCursor, size: 12, font: timesBoldFont });
      yCursor -= 20;

      // table header
      page.drawRectangle({ x: 50, y: yCursor - 5, width: 490, height: 20, color: rgb(0.9, 0.9, 0.9) });
      page.drawText('Valor', { x: 55, y: yCursor, size: 10, font: timesBoldFont });

      // table lines
      yCursor -= 20;
      incentives.forEach((inc) => {
        page.drawText(formatMoney(inc.valor), { x: 55, y: yCursor, size: 10 });
      })

      yCursor -= 20;
      page.drawRectangle({ x: 50, y: yCursor - 5, width: 490, height: 20, color: rgb(0.9, 0.9, 0.9) });
      page.drawText('TOTAL EM INCENTIVOS', { x: 55, y: yCursor, size: 10, font: timesBoldFont });
      page.drawText(formatMoney(totalIncentives), { x: 480, y: yCursor, size: 10, font: timesBoldFont });
    }

    // pdf generate and download 
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

}