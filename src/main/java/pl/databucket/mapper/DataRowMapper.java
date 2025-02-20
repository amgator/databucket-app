package pl.databucket.mapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.RowMapper;
import pl.databucket.service.data.COL;
import pl.databucket.dto.DataDto;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

public final class DataRowMapper implements RowMapper<DataDto> {

    @SneakyThrows
    @Override
    public DataDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        DataDto dataDto = new DataDto();
        dataDto.setId(rs.getLong(COL.DATA_ID));
        dataDto.setTagId(rs.getLong(COL.TAG_ID));
        dataDto.setReserved(rs.getBoolean(COL.RESERVED));
        dataDto.setOwner(rs.getString(COL.RESERVED_BY));
        dataDto.setProperties(convertPGObjectToMap((PGobject) rs.getObject(COL.PROPERTIES)));
        dataDto.setCreatedAt(rs.getDate(COL.CREATED_AT));
        dataDto.setCreatedBy(rs.getString(COL.CREATED_BY));
        dataDto.setModifiedAt(rs.getDate(COL.MODIFIED_AT));
        dataDto.setModifiedBy(rs.getString(COL.MODIFIED_BY));
        return dataDto;
    }

    public Map<String, Object> convertPGObjectToMap(PGobject source) throws JsonProcessingException {
        return new ObjectMapper().readValue(source.getValue(), new TypeReference<Map<String, Object>>() {
        });
    }
}

