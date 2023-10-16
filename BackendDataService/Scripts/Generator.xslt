<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:axsl="http://etebarsanji.com" >
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"  />
  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:param name="style"/>
  <xsl:template match="/" xml:space="preserve">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="report" xml:space="default">

    <xsl:variable name="pgSumCount" select="count(//aggregates/aggregate/positions[position='page'])"/>
    <xsl:variable name="rpSumCount" select="count(//aggregates/aggregate/positions[position='report'])"/>
    <xsl:variable name="natutalGroupsCount" select="count(//groupby/group[merge='false'])" />
    <xsl:variable name="allGroupsCount" select="count(//groupby/group)"/>

    <xsl:variable name ="rowno">
      <xsl:if test="printRowNo  = 'true'" >1</xsl:if>
      <xsl:if test="printRowNo != 'true'" >0</xsl:if>
    </xsl:variable>

    <axsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:axsl="http://etebarsanji.com">
      <axsl:template match="_report">
        <html>
          <head>
            <xsl:if test="$style">
              <style>
                <xsl:value-of select="$style"/>
              </style>
            </xsl:if>
            <axsl:apply-templates select="_c"  />
          </head>
          <body>
            <div class="rpReport">
              <div class="title">
                <xsl:value-of select="title"/>
              </div>
              <div class="subTitle">
                <xsl:value-of select="subTitle"/>
              </div>
              <table class="rpReportTableStyle">
                <tbody>

                  <xsl:if test="$allGroupsCount > 0">
                    <axsl:apply-templates select="{groupby/group[1]/name}"/>
                  </xsl:if>
                  <xsl:if test="$allGroupsCount = 0">
                    <xsl:call-template name="rowsHeader">
                      <xsl:with-param name="pgSumCount">
                        <xsl:value-of select="$pgSumCount"/>
                      </xsl:with-param>
                      <xsl:with-param name="rpSumCount">
                        <xsl:value-of select="$rpSumCount"/>
                      </xsl:with-param>
                      <xsl:with-param name="rowno">
                        <xsl:value-of select="$rowno"/>
                      </xsl:with-param>
                    </xsl:call-template>
                    <axsl:apply-templates select="_r"/>
                  </xsl:if>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      </axsl:template>

      <xsl:for-each select="//columns/column[mergepos &gt; 0]">
        <axsl:template name="{name}_merge">

          <xsl:variable name="condition">
            <xsl:call-template name="test_siblings"></xsl:call-template>
          </xsl:variable>
          <axsl:if test="{$condition}">
            <xsl:if test="position()=1 and $rowno = 1">
              <td scope="row_col">
                <!--print rowno-->
                <axsl:attribute name="rowspan">
                  <axsl:value-of select="ancestor::{name}/_c"/>
                </axsl:attribute>
                <axsl:value-of select="@n"/>
                <!-- شماره ردیف-->
              </td>
            </xsl:if>
            <TD>
              <axsl:if test="ancestor::{name}/_c > 1">
                <axsl:attribute name="rowspan">
                  <axsl:value-of select="ancestor::{name}/_c"/>
                </axsl:attribute>
                <axsl:attribute name="title" >
                  <axsl:value-of select="ancestor::{name}/_c"/> ردیف
                </axsl:attribute>
                <axsl:attribute name="style">background-color:#FCFCFC;</axsl:attribute>

              </axsl:if>
              <xsl:call-template name="colSpan">
                <xsl:with-param name="type" select="type"/>
                <xsl:with-param name="value" select="concat(concat('ancestor::', name), concat('/@', name))"/>
              </xsl:call-template>
            </TD>
          </axsl:if>
        </axsl:template>
      </xsl:for-each>

      <xsl:for-each select="//columns/column[mergepos = 0]">
        <axsl:template match="{name}">
          <TD>
            <xsl:call-template name="colSpan">
              <xsl:with-param name="type" select="type"/>
              <xsl:with-param name="value" select="'.'"/>
            </xsl:call-template>
          </TD>
        </axsl:template>
      </xsl:for-each>

      <axsl:template match="_ps">

        <div>
          PS(<axsl:value-of select="."/>)
        </div>
      </axsl:template>
      <axsl:template match="_pe">
        <div>
          PE(<axsl:value-of select="."/>)
        </div>
      </axsl:template>
      <axsl:template match="_r">
        <axsl:apply-templates select="_ps"/>
        <tr>
          <xsl:if test="$pgSumCount > 0">
            <td scope="pg_sum_col"/>
          </xsl:if>
          <xsl:if test="$rpSumCount > 0">
            <td scope="rp_sum_col"/>
          </xsl:if>
          <xsl:for-each select="//groupby/group[merge='false']">
            <td scope="gp_sum_col" class="groupClass groupClass{position()}"/>
          </xsl:for-each>

          <xsl:if test="$rowno =1">
            <xsl:variable name="hasMerge" select ="count(//columns/column[mergepos &gt; 0])"/>
            <xsl:if test="$hasMerge = 0">
              <td scope="row_col">
                <xsl:value-of select="$hasMerge"/>
                <axsl:value-of select="@n"/>
                <!-- شماره ردیف-->
              </td>
            </xsl:if>
          </xsl:if>

          <xsl:for-each select="//columns/column">
            <xsl:if test="mergepos &gt; 0">
              <axsl:call-template name="{name}_merge"/>
            </xsl:if>
            <xsl:if test="mergepos = 0">
              <axsl:apply-templates select="{name}"/>
            </xsl:if>
          </xsl:for-each>
        </tr>
      </axsl:template>
      <axsl:template match="_c">
        <script>
          var recordCount = <axsl:value-of select="."/>;
        </script>
      </axsl:template>
      <!-- building group templates -->

      <xsl:for-each select="//groupby/group">
        <axsl:template match="{name}">
          <!--ساختن پیکره برای همه گروه ها-->
          <!--groupName-->

          <xsl:if test ="merge='false'">
            <!--برای گروه های ساده تیتر زده شود-->
            <!--group header-->
            <xsl:call-template name="groupHeader">
              <xsl:with-param name="pgSumCount">
                <xsl:value-of select="$pgSumCount"/>
              </xsl:with-param>
              <xsl:with-param name="rpSumCount">
                <xsl:value-of select="$rpSumCount"/>
              </xsl:with-param>
              <xsl:with-param name="rowno">
                <xsl:value-of select="$rowno"/>
              </xsl:with-param>
            </xsl:call-template>
          </xsl:if>

          <xsl:if test="position() = $allGroupsCount">
            <!--اگر به آخرین گروه چه طبیعی و چه همردیف برسیم-->
            <xsl:if test="merge='true'">
              <axsl:if test ="_ps = 1">
                <xsl:call-template name="rowsHeader">
                  <!--عنوان ستونها را چاپ می کنیم-->
                  <xsl:with-param name="pgSumCount">
                    <xsl:value-of select="$pgSumCount"/>
                  </xsl:with-param>
                  <xsl:with-param name="rpSumCount">
                    <xsl:value-of select="$rpSumCount"/>
                  </xsl:with-param>
                  <xsl:with-param name="rowno">
                    <xsl:value-of select="$rowno"/>
                  </xsl:with-param>
                </xsl:call-template>
              </axsl:if>
            </xsl:if>

            <xsl:if test="merge='false'">
              <xsl:call-template name="rowsHeader">
                <!--عنوان ستونها را چاپ می کنیم-->
                <xsl:with-param name="pgSumCount">
                  <xsl:value-of select="$pgSumCount"/>
                </xsl:with-param>
                <xsl:with-param name="rpSumCount">
                  <xsl:value-of select="$rpSumCount"/>
                </xsl:with-param>
                <xsl:with-param name="rowno">
                  <xsl:value-of select="$rowno"/>
                </xsl:with-param>
              </xsl:call-template>
            </xsl:if>

            <axsl:apply-templates select="_r"/>
            <!--ردیف ها زیر آخرین گروه هستند که همین گروه است-->
          </xsl:if>
          <xsl:if test="position() != $allGroupsCount">
            <!--اگر هنوز به آخرین گروه نرسیده باشیم درخواست اجرای گروه پایینی را می نویسیم-->
            <axsl:apply-templates select="{following::group/name}"/>
          </xsl:if>
          <!--group aggregates-->
          <xsl:call-template name="Aggregates">
            <xsl:with-param name="aggPosName" select="name"/>
            <xsl:with-param name="pgSumCount" select="$pgSumCount"/>
            <xsl:with-param name="rpSumCount" select="$rpSumCount"/>
            <xsl:with-param name="rowno" select="$rowno"/>
          </xsl:call-template>
        </axsl:template>

      </xsl:for-each>
    </axsl:stylesheet>

  </xsl:template>

  <xsl:template name="colSpan">
    <xsl:param name="value"/>
    <xsl:param name="type"/>

    <span>
      <xsl:if test="($type != 'String')" >
        <xsl:attribute name="style">direction:ltr</xsl:attribute>
      </xsl:if>

      <xsl:if test="($type = 'url')" >
        <axsl:variable name="hr" select="." />
        <xsl:text disable-output-escaping="yes">
                <![CDATA[<a href="{$hr}" target="_blank">ببینید</a>]]></xsl:text>
      </xsl:if>

      <xsl:if test="($type != 'url')" >
        <axsl:value-of select="{$value}"/>
      </xsl:if>
    </span>
  </xsl:template>

  <xsl:template name="rowsHeader">
    <xsl:param name="pgSumCount"/>
    <xsl:param name="rpSumCount"/>
    <xsl:param name="rowno"/>

    <tr>
      <xsl:if test="$pgSumCount &gt; 0">
        <th scope="pg_col_head"/>
      </xsl:if>
      <xsl:if test="$rpSumCount &gt; 0">
        <th scope="rp_col_head"/>
      </xsl:if>
      <xsl:for-each select="//groupby/group[merge='false']">
        <td scope="gp_sum_col" class="groupClass groupClass{position()}"/>
      </xsl:for-each>
      <xsl:if test="$rowno =1">
        <td scope="rowno_hd">ردیف</td>
      </xsl:if>
      <xsl:for-each select="//columns/column">
        <th scope="col_head">
          <xsl:value-of select="title"/>
        </th>
      </xsl:for-each>
    </tr>
  </xsl:template>

  <xsl:template name="groupHeader">
    <xsl:param name="pgSumCount"/>
    <xsl:param name="rpSumCount"/>
    <xsl:param name="rowno"/>

    <!--<axsl:if test ="0=0">-->
    <tr>
      <xsl:if test="$rpSumCount &gt; 0">
        <td class="groupHeader" scope="rp_span_cells"></td>
      </xsl:if>
      <xsl:if test="$pgSumCount &gt; 0">
        <td class="groupHeader" scope="pg_span_cells"></td>
      </xsl:if>

      <xsl:variable  name="pos" select="position()"/>
      <xsl:for-each select="(//node())[ $pos > (position())]">
        <td class="groupHeader groupClass groupClass{position()}"></td>
      </xsl:for-each>

      <td class="groupHeader groupClass groupClass{position()}" colspan="{ count(//columns/column) +count(//groupby/group[merge='false']) + 1 +$rowno - position() }">
        <xsl:value-of select="title" /> : <axsl:value-of select="@{name}"/>
      </td>
    </tr>
    <!--</axsl:if>-->
  </xsl:template>

  <xsl:template name="Aggregates">
    <xsl:param name="aggPosName"/>
    <xsl:param name="pgSumCount"/>
    <xsl:param name="rpSumCount"/>
    <xsl:param name="rowno"/>

    <!-- برای یک گروه مشخص
 انواع خلاصه ها را مرتب می کنیم
 برای هر خلاصه ردیف می زنیم
-->
    <xsl:for-each select="//aggregates/aggregate/positions[position=$aggPosName]" >
      <!--_page, _report, groupName-->
      <xsl:variable name="aggType" select="../type"></xsl:variable>
      <xsl:for-each select="//aggregates/aggregate[type=$aggType]/positions[position=$aggPosName]" >
        <xsl:variable name="aggColumn" select=".."></xsl:variable>
        <axsl:if test="count({$aggType}/*) != 0">
          <tr class="aggregate">
            <xsl:if test="$pgSumCount > 0">
              <td scope="pg_sum_row">
                <xsl:if test="$aggPosName = 'page'">جمع:</xsl:if>
              </td>
            </xsl:if>
            <xsl:if test="$rpSumCount > 0">
              <td scope="rp_sum_row">
                <xsl:if test="$aggPosName = 'report'">جمع:</xsl:if>
              </td>
            </xsl:if>
            <xsl:for-each select="//groupby/group[merge='false']">
              <td scope="gp_sum_row">
                <xsl:if test="$aggPosName = name">جمع:</xsl:if>
              </td>
            </xsl:for-each>
            <xsl:if test="$rowno = 1">
              <td></td>
            </xsl:if>
            <xsl:for-each select="//columns/column">
              <td >
                <xsl:if test="$aggColumn/name = name">
                  <!--اطلاعات بایستی از هرنود گروه یا صفحه یا گزارش برداشته شده و در این محل نوشته شود-->
                  <xsl:attribute name="class">aggregate</xsl:attribute>
                  <axsl:value-of  select="{$aggType}/{name}" />
                </xsl:if>
              </td>
            </xsl:for-each>
          </tr>
        </axsl:if>
      </xsl:for-each>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="test_siblings">
    <xsl:for-each select="following-sibling::*[mergepos &gt; 0]">
      <xsl:if test="position() &gt; 1"> and </xsl:if>count(ancestor::<xsl:value-of select="name"/>/preceding-sibling::<xsl:value-of select="name"/>) = 0
    </xsl:for-each>
    <xsl:if test="count(following-sibling::*[mergepos &gt; 0]) &gt; 0"> and </xsl:if>count(preceding-sibling::_r) = 0
  </xsl:template>

  <xsl:template name="repeat">
    <xsl:param name="output" />
    <xsl:param name="count" />
    <xsl:if test="$count &gt; 0">
      <xsl:value-of select="$output" />
      <xsl:call-template name="repeat">
        <xsl:with-param name="output" select="$output" />
        <xsl:with-param name="count" select="$count - 1" />
      </xsl:call-template>
    </xsl:if>
  </xsl:template>


</xsl:stylesheet>
