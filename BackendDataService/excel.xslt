<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/><xsl:template match="_report"><_report> <xsl:apply-templates select="//_r"/></_report></xsl:template><xsl:template match="_r"><_><A1><xsl:value-of select="ancestor::A1/@A1"/></A1><A2><xsl:value-of select="ancestor::A2/@A2"/></A2><A3><xsl:value-of select="A3"/></A3></_></xsl:template></xsl:stylesheet>